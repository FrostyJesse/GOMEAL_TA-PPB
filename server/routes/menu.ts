import { Router } from 'express';
import { query } from '../lib/db';
import { authMiddleware, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import multer from 'multer';

export const menuRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/v1/menu
menuRouter.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sort } = req.query;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, parseInt(String(limit), 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    const whereClauses: string[] = ['m.is_available = true'];
    const params: any[] = [];

    if (category && category !== 'Semua') {
      params.push(category);
      whereClauses.push(`(c.name = $${params.length} OR m.category_id::text = $${params.length})`);
    }

    if (search && String(search).trim() !== '') {
      params.push(`%${String(search).trim()}%`);
      whereClauses.push(`(m.name ILIKE $${params.length} OR m.description ILIKE $${params.length})`);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Hitung total items
    const countResult = await query(
      `SELECT COUNT(*)::int as total
       FROM menus m
       LEFT JOIN categories c ON m.category_id = c.id
       ${whereSQL}`,
      params
    );
    const total = countResult.rows[0]?.total || 0;

    // Sorting
    let orderSQL = 'ORDER BY m.rating DESC, m.name ASC';
    if (sort === 'price_asc') {
      orderSQL = 'ORDER BY m.price ASC';
    } else if (sort === 'price_desc') {
      orderSQL = 'ORDER BY m.price DESC';
    } else if (sort === 'name') {
      orderSQL = 'ORDER BY m.name ASC';
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
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar menu', error: error.message });
  }
});

// GET /api/v1/menu/:id
menuRouter.get('/:id', async (req, res) => {
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
      return res.status(404).json({ message: 'Menu makanan tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching menu detail:', error);
    res.status(500).json({ message: 'Gagal mengambil detail menu', error: error.message });
  }
});

// POST /api/v1/menu (Admin Only)
menuRouter.post('/', authMiddleware, requireAdmin, upload.single('image'), async (req: AuthenticatedRequest, res) => {
  try {
    const { name, category_id, description, price, stock_quantity = 100, image_url, preparation_time = '15 menit' } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Nama dan harga makanan wajib diisi' });
    }

    const result = await query(
      `INSERT INTO menus (name, category_id, description, price, stock_quantity, image_url, preparation_time, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       RETURNING *`,
      [name, category_id || null, description || '', parseInt(price, 10), parseInt(stock_quantity, 10), image_url || '', preparation_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Gagal menambahkan menu baru', error: error.message });
  }
});

// PUT /api/v1/menu/:id (Admin Only)
menuRouter.put('/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
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
        stock_quantity !== undefined ? parseInt(stock_quantity, 10) : null,
        image_url,
        preparation_time,
        is_available,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating menu:', error);
    res.status(500).json({ message: 'Gagal memperbarui menu', error: error.message });
  }
});

// DELETE /api/v1/menu/:id (Admin Only)
menuRouter.delete('/:id', authMiddleware, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM menus WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting menu:', error);
    res.status(500).json({ message: 'Gagal menghapus menu', error: error.message });
  }
});
