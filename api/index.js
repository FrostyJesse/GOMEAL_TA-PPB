import express, { Router } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import pg from "pg";
import "dotenv/config";
import multer from "multer";
const { Pool, types } = pg;
types.setTypeParser(20, (val) => parseInt(val, 10));
types.setTypeParser(1700, (val) => parseFloat(val));
let poolInstance = null;
function getPool() {
  if (!poolInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required.");
    }
    poolInstance = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 3e4,
      connectionTimeoutMillis: 1e4
    });
    poolInstance.on("error", (err) => {
      console.error("Database pool error:", err.message);
    });
  }
  return poolInstance;
}
new Proxy({}, {
  get(_target, prop) {
    const p = getPool();
    const val = p[prop];
    if (typeof val === "function") {
      return val.bind(p);
    }
    return val;
  }
});
async function query(text, params) {
  try {
    return await getPool().query(text, params);
  } catch (error) {
    console.error("DB query error:", error.message);
    throw error;
  }
}
async function getClient() {
  const client = await getPool().connect();
  return client;
}
const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter")
});
const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi")
});
const checkoutSchema = z.object({
  recipient_name: z.string().min(1, "Nama penerima wajib diisi"),
  recipient_phone: z.string().min(1, "Nomor telepon wajib diisi"),
  delivery_address: z.string().min(1, "Alamat pengiriman wajib diisi"),
  customer_note: z.string().optional().default(""),
  payment_method: z.enum(["cod", "transfer_bank", "qris"], {
    required_error: "Pilih metode pembayaran"
  }),
  items: z.array(z.object({
    menu_id: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1, "Keranjang tidak boleh kosong")
});
const profileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  address: z.string().optional()
});
const JWT_SECRET$1 = process.env.JWT_SECRET || "gomeal_secure_jwt_secret_2024_xK9mP2nQ7wR4tY6u";
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    return res.status(401).json({ message: "Token otentikasi tidak ditemukan. Silakan login terlebih dahulu." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET$1);
    req.user = decoded;
    if (typeof next === "function") next();
  } catch (error) {
    return res.status(401).json({ message: "Sesi login telah kedaluwarsa atau token tidak valid." });
  }
};
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak. Tindakan ini memerlukan hak akses Admin." });
  }
  if (typeof next === "function") next();
};
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "gomeal_secure_jwt_secret_2024_xK9mP2nQ7wR4tY6u";
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);
    const existing = await query(
      "SELECT id, email, username FROM users WHERE email = $1 OR username = $2 LIMIT 1",
      [email, username]
    );
    if (existing.rows.length > 0) {
      const match = existing.rows[0];
      if (match.email === email) {
        return res.status(409).json({ message: "Email sudah terdaftar. Silakan gunakan email lain atau login." });
      }
      return res.status(409).json({ message: "Username sudah digunakan. Silakan pilih username lain." });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const result = await query(
      `INSERT INTO users (email, username, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, email, username, role, created_at`,
      [email, username, password_hash]
    );
    const newUser = result.rows[0];
    await query(
      `INSERT INTO profiles (id, full_name, phone, address)
       VALUES ($1, $2, '', '')
       ON CONFLICT (id) DO NOTHING`,
      [newUser.id, username]
    );
    res.status(201).json({
      message: "Registrasi berhasil. Silakan login.",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validasi gagal", errors: error.errors });
    }
    console.error("Register error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat mendaftar." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = loginSchema.parse(req.body);
    const result = await query(
      "SELECT id, email, username, password_hash, role FROM users WHERE email = $1 OR username = $1 LIMIT 1",
      [identifier]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email/Username atau password salah." });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email/Username atau password salah." });
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validasi gagal", errors: error.errors });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat login." });
  }
});
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const result = await query(
      `SELECT u.id, u.email, u.username, u.role, u.created_at,
              p.full_name, p.phone, p.avatar_url, p.address
       FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Auth /me error:", error);
    res.status(500).json({ message: "Gagal mengambil data user." });
  }
});
const authRoutes = router;
const menuRouter = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
menuRouter.get("/", async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sort } = req.query;
    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, parseInt(String(limit), 10) || 20);
    const offset = (pageNum - 1) * limitNum;
    const whereClauses = ["m.is_available = true"];
    const params = [];
    if (category && category !== "Semua") {
      params.push(category);
      whereClauses.push(`(c.name = $${params.length} OR m.category_id::text = $${params.length})`);
    }
    if (search && String(search).trim() !== "") {
      params.push(`%${String(search).trim()}%`);
      whereClauses.push(`(m.name ILIKE $${params.length} OR m.description ILIKE $${params.length})`);
    }
    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const countResult = await query(
      `SELECT COUNT(*)::int as total
       FROM menus m
       LEFT JOIN categories c ON m.category_id = c.id
       ${whereSQL}`,
      params
    );
    const total = countResult.rows[0]?.total || 0;
    let orderSQL = "ORDER BY m.rating DESC, m.name ASC";
    if (sort === "price_asc") {
      orderSQL = "ORDER BY m.price ASC";
    } else if (sort === "price_desc") {
      orderSQL = "ORDER BY m.price DESC";
    } else if (sort === "name") {
      orderSQL = "ORDER BY m.name ASC";
    }
    params.push(limitNum);
    const limitParam = params.length;
    params.push(offset);
    const offsetParam = params.length;
    const itemsResult = await query(
      `SELECT m.id, m.category_id, m.name, m.description, m.price,
              m.image_url, m.stock_quantity, m.is_available, m.rating,
              m.preparation_time, m.created_at, m.updated_at,
              c.name AS category_name
       FROM menus m
       LEFT JOIN categories c ON m.category_id = c.id
       ${whereSQL}
       ${orderSQL}
       LIMIT $${limitParam} OFFSET $${offsetParam}`,
      params
    );
    res.json({
      data: itemsResult.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Gagal mengambil daftar menu", error: error.message });
  }
});
menuRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT m.id, m.category_id, m.name, m.description, m.price,
              m.image_url, m.stock_quantity, m.is_available, m.rating,
              m.preparation_time, m.created_at, m.updated_at,
              c.name AS category_name
       FROM menus m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Menu makanan tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching menu detail:", error);
    res.status(500).json({ message: "Gagal mengambil detail menu", error: error.message });
  }
});
menuRouter.post("/", authMiddleware, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, category_id, description, price, stock_quantity = 100, image_url, preparation_time = "15 menit" } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: "Nama dan harga makanan wajib diisi" });
    }
    const result = await query(
      `INSERT INTO menus (name, category_id, description, price, stock_quantity, image_url, preparation_time, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [name, category_id || null, description || "", parseInt(price, 10), parseInt(stock_quantity, 10), image_url || "", preparation_time]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Gagal menambahkan menu baru", error: error.message });
  }
});
menuRouter.put("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id, description, price, stock_quantity, image_url, preparation_time, is_available } = req.body;
    const result = await query(
      `UPDATE menus
       SET name = COALESCE($1, name),
           category_id = COALESCE($2, category_id),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           stock_quantity = COALESCE($5, stock_quantity),
           image_url = COALESCE($6, image_url),
           preparation_time = COALESCE($7, preparation_time),
           is_available = COALESCE($8, is_available),
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        name,
        category_id,
        description,
        price ? parseInt(price, 10) : null,
        stock_quantity !== void 0 ? parseInt(stock_quantity, 10) : null,
        image_url,
        preparation_time,
        is_available,
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ message: "Gagal memperbarui menu", error: error.message });
  }
});
menuRouter.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM menus WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Menu tidak ditemukan" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({ message: "Gagal menghapus menu", error: error.message });
  }
});
const categoriesRouter = Router();
categoriesRouter.get("/", async (_req, res) => {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.description, c.image_url, c.created_at,
              COUNT(m.id)::int as menu_count
       FROM categories c
       LEFT JOIN menus m ON c.id = m.category_id AND m.is_available = true
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Gagal mengambil kategori", error: error.message });
  }
});
const ordersRouter = Router();
ordersRouter.use(authMiddleware);
ordersRouter.get("/", async (req, res) => {
  try {
    const userId = req.user.sub;
    const result = await query(
      `SELECT o.id, o.user_id, o.status, o.subtotal, o.delivery_fee, o.discount,
              o.total_price, o.recipient_name, o.recipient_phone, o.delivery_address,
              o.customer_note, o.payment_method, o.created_at, o.updated_at,
              (
                SELECT json_agg(json_build_object(
                  'id', oi.id,
                  'item_name', oi.item_name,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'subtotal', oi.subtotal,
                  'image_url', m.image_url
                ))
                FROM order_items oi
                LEFT JOIN menus m ON oi.menu_id = m.id
                WHERE oi.order_id = o.id
              ) as items
       FROM orders o
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Gagal mengambil riwayat pesanan", error: error.message });
  }
});
ordersRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const isAdmin = req.user.role === "admin";
    const orderQuery = isAdmin ? "SELECT * FROM orders WHERE id = $1" : "SELECT * FROM orders WHERE id = $1 AND user_id = $2";
    const orderParams = isAdmin ? [id] : [id, userId];
    const orderResult = await query(orderQuery, orderParams);
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan atau Anda tidak memiliki akses." });
    }
    const order = orderResult.rows[0];
    const itemsResult = await query(
      `SELECT oi.id, oi.order_id, oi.menu_id, oi.item_name, oi.quantity,
              oi.unit_price, oi.subtotal, m.image_url
       FROM order_items oi
       LEFT JOIN menus m ON oi.menu_id = m.id
       WHERE oi.order_id = $1`,
      [id]
    );
    res.json({
      ...order,
      items: itemsResult.rows
    });
  } catch (error) {
    console.error("Error fetching order detail:", error);
    res.status(500).json({ message: "Gagal mengambil detail pesanan", error: error.message });
  }
});
ordersRouter.post("/", async (req, res) => {
  const client = await getClient();
  try {
    const userId = req.user.sub;
    const parsedData = checkoutSchema.parse(req.body);
    const { recipient_name, recipient_phone, delivery_address, customer_note, payment_method, items } = parsedData;
    await client.query("BEGIN");
    const menuIds = items.map((i) => i.menu_id);
    const menusResult = await client.query(
      `SELECT id, name, price, stock_quantity, is_available
       FROM menus
       WHERE id = ANY($1::uuid[])
       FOR UPDATE`,
      [menuIds]
    );
    const dbMenusMap = /* @__PURE__ */ new Map();
    for (const row of menusResult.rows) {
      dbMenusMap.set(row.id, row);
    }
    let calculatedSubtotal = 0;
    const preparedItems = [];
    for (const item of items) {
      const dbMenu = dbMenusMap.get(item.menu_id);
      if (!dbMenu) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Makanan dengan ID ${item.menu_id} tidak ditemukan.` });
      }
      if (!dbMenu.is_available) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: `Maaf, "${dbMenu.name}" saat ini sedang tidak tersedia.` });
      }
      if (dbMenu.stock_quantity < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: `Stok "${dbMenu.name}" tidak mencukupi. Tersisa ${dbMenu.stock_quantity} porsi.`
        });
      }
      const unitPrice = parseInt(dbMenu.price, 10);
      const itemSubtotal = unitPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;
      preparedItems.push({
        menu_id: item.menu_id,
        item_name: dbMenu.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal
      });
    }
    const deliveryFee = 1e4;
    const discount = calculatedSubtotal > 1e5 ? Math.floor(calculatedSubtotal * 0.1) : 0;
    const finalTotal = calculatedSubtotal + deliveryFee - discount;
    const orderInsertResult = await client.query(
      `INSERT INTO orders (
        user_id, status, subtotal, delivery_fee, discount, total_price,
        recipient_name, recipient_phone, delivery_address, customer_note, payment_method
      ) VALUES ($1, 'menunggu_konfirmasi', $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [
        userId,
        calculatedSubtotal,
        deliveryFee,
        discount,
        finalTotal,
        recipient_name,
        recipient_phone,
        delivery_address,
        customer_note || "",
        payment_method
      ]
    );
    const orderId = orderInsertResult.rows[0].id;
    for (const item of preparedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_id, item_name, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.menu_id, item.item_name, item.quantity, item.unit_price, item.subtotal]
      );
      await client.query(
        `UPDATE menus
         SET stock_quantity = stock_quantity - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, item.menu_id]
      );
    }
    await client.query("COMMIT");
    res.status(201).json({
      order_id: orderId,
      message: "Pesanan berhasil dibuat!"
    });
  } catch (error) {
    await client.query("ROLLBACK");
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validasi checkout gagal", errors: error.errors });
    }
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Gagal memproses pesanan. Silakan coba lagi.", error: error.message });
  } finally {
    client.release();
  }
});
ordersRouter.patch("/:id/cancel", async (req, res) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const isAdmin = req.user.role === "admin";
    await client.query("BEGIN");
    const checkQuery = isAdmin ? "SELECT id, status FROM orders WHERE id = $1 FOR UPDATE" : "SELECT id, status FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE";
    const checkParams = isAdmin ? [id] : [id, userId];
    const orderResult = await client.query(checkQuery, checkParams);
    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }
    const order = orderResult.rows[0];
    if (order.status !== "menunggu_konfirmasi") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Pesanan tidak dapat dibatalkan karena sudah diproses atau selesai."
      });
    }
    await client.query(
      "UPDATE orders SET status = 'dibatalkan', updated_at = NOW() WHERE id = $1",
      [id]
    );
    const itemsResult = await client.query(
      "SELECT menu_id, quantity FROM order_items WHERE order_id = $1 AND menu_id IS NOT NULL",
      [id]
    );
    for (const item of itemsResult.rows) {
      await client.query(
        "UPDATE menus SET stock_quantity = stock_quantity + $1, updated_at = NOW() WHERE id = $2",
        [item.quantity, item.menu_id]
      );
    }
    await client.query("COMMIT");
    res.json({ message: "Pesanan berhasil dibatalkan dan stok telah dikembalikan." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Gagal membatalkan pesanan", error: error.message });
  } finally {
    client.release();
  }
});
const profileRouter = Router();
profileRouter.use(authMiddleware);
profileRouter.get("/", async (req, res) => {
  try {
    const userId = req.user.sub;
    const result = await query(
      `SELECT u.id, u.email, u.username, u.role, u.created_at,
              COALESCE(p.full_name, '') as full_name,
              COALESCE(p.phone, '') as phone,
              COALESCE(p.avatar_url, '') as avatar_url,
              COALESCE(p.address, '') as address,
              p.updated_at
       FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profil tidak ditemukan" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Gagal mengambil data profil", error: error.message });
  }
});
profileRouter.put("/", async (req, res) => {
  try {
    const userId = req.user.sub;
    const { full_name, phone, avatar_url, address } = profileSchema.parse(req.body);
    const result = await query(
      `INSERT INTO profiles (id, full_name, phone, avatar_url, address, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) DO UPDATE
       SET full_name = COALESCE($2, profiles.full_name),
           phone = COALESCE($3, profiles.phone),
           avatar_url = COALESCE($4, profiles.avatar_url),
           address = COALESCE($5, profiles.address),
           updated_at = NOW()
       RETURNING *`,
      [userId, full_name, phone, avatar_url, address]
    );
    res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validasi profil gagal", errors: error.errors });
    }
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Gagal memperbarui profil", error: error.message });
  }
});
const favoritesRouter = Router();
favoritesRouter.use(authMiddleware);
favoritesRouter.get("/", async (req, res) => {
  try {
    const userId = req.user.sub;
    const result = await query(
      `SELECT f.id, f.user_id, f.menu_id, f.created_at,
              m.name, m.price, m.image_url, m.rating, m.description,
              c.name as category_name
       FROM favorites f
       JOIN menus m ON f.menu_id = m.id
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Gagal mengambil daftar favorit", error: error.message });
  }
});
favoritesRouter.post("/", async (req, res) => {
  try {
    const userId = req.user.sub;
    const { menu_id } = req.body;
    if (!menu_id) {
      return res.status(400).json({ message: "menu_id wajib diberikan" });
    }
    const result = await query(
      `INSERT INTO favorites (user_id, menu_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, menu_id) DO NOTHING
       RETURNING id, user_id, menu_id, created_at`,
      [userId, menu_id]
    );
    if (result.rows.length === 0) {
      return res.json({ message: "Makanan sudah ada di daftar favorit" });
    }
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({ message: "Gagal menambahkan favorit", error: error.message });
  }
});
favoritesRouter.delete("/:menuId", async (req, res) => {
  try {
    const userId = req.user.sub;
    const { menuId } = req.params;
    await query(
      "DELETE FROM favorites WHERE user_id = $1 AND menu_id = $2",
      [userId, menuId]
    );
    res.status(204).send();
  } catch (error) {
    console.error("Error removing favorite:", error);
    res.status(500).json({ message: "Gagal menghapus favorit", error: error.message });
  }
});
function createServer() {
  const app2 = express();
  app2.set("trust proxy", 1);
  app2.use(
    helmet({
      contentSecurityPolicy: false
      // Menghindari isu blokir gambar dari unsplash/cdn
    })
  );
  app2.use(cors({ origin: true, credentials: true }));
  app2.use(express.json());
  app2.use(express.urlencoded({ extended: true }));
  app2.use((req, _res, next) => {
    if (req.url && req.originalUrl && (req.url.startsWith("/api/index") || req.url === "/api")) {
      req.url = req.originalUrl;
    }
    next();
  });
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    validate: { xForwardedForHeader: false, default: false }
  });
  app2.use(limiter);
  app2.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "GOMeal API",
      tagline: "Good Food, Good Mood!",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app2.use("/api/auth", authRoutes);
  app2.use("/api/v1/menu", menuRouter);
  app2.use("/api/v1/categories", categoriesRouter);
  app2.use("/api/v1/orders", ordersRouter);
  app2.use("/api/v1/profile", profileRouter);
  app2.use("/api/v1/favorites", favoritesRouter);
  app2.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    if (res && typeof res.status === "function") {
      res.status(500).json({
        message: "Terjadi kesalahan internal pada server",
        error: process.env.NODE_ENV === "development" ? err.message : void 0
      });
    }
  });
  return app2;
}
const app = createServer();
function handler(req, res) {
  return app(req, res);
}
export {
  handler as default
};
