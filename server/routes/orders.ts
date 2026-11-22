import { Router } from 'express';
import { query, getClient } from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { checkoutSchema } from '../../shared/schema';
import { z } from 'zod';

export const ordersRouter = Router();

// Seluruh route orders diproteksi token JWT
ordersRouter.use(authMiddleware);

// GET /api/v1/orders - Riwayat pesanan milik pengguna yang login
ordersRouter.get('/', async (req: any, res: any) => {
  try {
    const userId = req.user!.sub;

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
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat pesanan', error: error.message });
  }
});

// GET /api/v1/orders/:id - Detail pesanan tertentu
ordersRouter.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;
    const isAdmin = req.user!.role === 'admin';

    const orderQuery = isAdmin
      ? 'SELECT * FROM orders WHERE id = $1'
      : 'SELECT * FROM orders WHERE id = $1 AND user_id = $2';
    const orderParams = isAdmin ? [id] : [id, userId];

    const orderResult = await query(orderQuery, orderParams);

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan atau Anda tidak memiliki akses.' });
    }

    const order = orderResult.rows[0];

    // Ambil order items beserta gambar menu
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
      items: itemsResult.rows,
    });
  } catch (error: any) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ message: 'Gagal mengambil detail pesanan', error: error.message });
  }
});

// POST /api/v1/orders - Checkout pesanan baru dengan TRANSAKSI DATABASE ATOMIK
ordersRouter.post('/', async (req: any, res: any) => {
  const client = await getClient();
  try {
    const userId = req.user!.sub;
    const parsedData = checkoutSchema.parse(req.body);

    const { recipient_name, recipient_phone, delivery_address, customer_note, payment_method, items } = parsedData;

    // Mulai transaksi atomik
    await client.query('BEGIN');

    // 1. Ambil data menu terkini dari database dan kunci baris (FOR UPDATE) untuk mencegah race condition
    const menuIds = items.map((i) => i.menu_id);
    const menusResult = await client.query(
      `SELECT id, name, price, stock_quantity, is_available
       FROM menus
       WHERE id = ANY($1::uuid[])
       FOR UPDATE`,
      [menuIds]
    );

    const dbMenusMap = new Map<string, any>();
    for (const row of menusResult.rows) {
      dbMenusMap.set(row.id, row);
    }

    // 2. Validasi ketersediaan dan stok untuk setiap item yang dipesan
    let calculatedSubtotal = 0;
    const preparedItems: {
      menu_id: string;
      item_name: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const dbMenu = dbMenusMap.get(item.menu_id);
      if (!dbMenu) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Makanan dengan ID ${item.menu_id} tidak ditemukan.` });
      }

      if (!dbMenu.is_available) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: `Maaf, "${dbMenu.name}" saat ini sedang tidak tersedia.` });
      }

      if (dbMenu.stock_quantity < item.quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          message: `Stok "${dbMenu.name}" tidak mencukupi. Tersisa ${dbMenu.stock_quantity} porsi.`,
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
        subtotal: itemSubtotal,
      });
    }

    // 3. Hitung biaya pengiriman & total
    const deliveryFee = 10000; // Flat Rp10.000
    const discount = calculatedSubtotal > 100000 ? Math.floor(calculatedSubtotal * 0.1) : 0; // Diskon 10% jika > 100rb
    const finalTotal = calculatedSubtotal + deliveryFee - discount;

    // 4. Buat order di tabel orders
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
        customer_note || '',
        payment_method,
      ]
    );

    const orderId = orderInsertResult.rows[0].id;

    // 5. Masukkan order_items snapshot dan kurangi stok
    for (const item of preparedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_id, item_name, quantity, unit_price, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.menu_id, item.item_name, item.quantity, item.unit_price, item.subtotal]
      );

      // Kurangi stok menu secara atomik
      await client.query(
        `UPDATE menus
         SET stock_quantity = stock_quantity - $1,
             updated_at = NOW()
         WHERE id = $2`,
        [item.quantity, item.menu_id]
      );
    }

    // Commit transaksi
    await client.query('COMMIT');

    res.status(201).json({
      order_id: orderId,
      message: 'Pesanan berhasil dibuat!',
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validasi checkout gagal', errors: error.errors });
    }
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Gagal memproses pesanan. Silakan coba lagi.', error: error.message });
  } finally {
    client.release();
  }
});

// PATCH /api/v1/orders/:id/status - Update status pesanan (Admin / Simulasi Demo)
ordersRouter.patch('/:id/status', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['menunggu_konfirmasi', 'diproses', 'sedang_diantar', 'selesai', 'dibatalkan'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const result = await query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.json({
      message: `Status pesanan berhasil diubah menjadi ${status}`,
      order: result.rows[0],
    });
  } catch (error: any) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Gagal memperbarui status pesanan', error: error.message });
  }
});

// PATCH /api/v1/orders/:id/cancel - Batalkan pesanan & pulihkan stok
ordersRouter.patch('/:id/cancel', async (req: any, res: any) => {
  const client = await getClient();
  try {
    const { id } = req.params;
    const userId = req.user!.sub;
    const isAdmin = req.user!.role === 'admin';

    await client.query('BEGIN');

    // Cek pesanan
    const checkQuery = isAdmin
      ? 'SELECT id, status FROM orders WHERE id = $1 FOR UPDATE'
      : 'SELECT id, status FROM orders WHERE id = $1 AND user_id = $2 FOR UPDATE';
    const checkParams = isAdmin ? [id] : [id, userId];

    const orderResult = await client.query(checkQuery, checkParams);
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    const order = orderResult.rows[0];
    if (order.status !== 'menunggu_konfirmasi') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        message: 'Pesanan tidak dapat dibatalkan karena sudah diproses atau selesai.',
      });
    }

    // Update status pesanan
    await client.query(
      "UPDATE orders SET status = 'dibatalkan', updated_at = NOW() WHERE id = $1",
      [id]
    );

    // Pulihkan stok makanan
    const itemsResult = await client.query(
      'SELECT menu_id, quantity FROM order_items WHERE order_id = $1 AND menu_id IS NOT NULL',
      [id]
    );

    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE menus SET stock_quantity = stock_quantity + $1, updated_at = NOW() WHERE id = $2',
        [item.quantity, item.menu_id]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Pesanan berhasil dibatalkan dan stok telah dikembalikan.' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Gagal membatalkan pesanan', error: error.message });
  } finally {
    client.release();
  }
});
