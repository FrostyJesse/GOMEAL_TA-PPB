import { Router } from 'express';
import { query } from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

export const favoritesRouter = Router();

favoritesRouter.use(authMiddleware);

// GET /api/v1/favorites - Ambil daftar makanan favorit user
favoritesRouter.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.sub;

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
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Gagal mengambil daftar favorit', error: error.message });
  }
});

// POST /api/v1/favorites - Tambah makanan ke favorit
favoritesRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.sub;
    const { menu_id } = req.body;

    if (!menu_id) {
      return res.status(400).json({ message: 'menu_id wajib diberikan' });
    }

    const result = await query(
      `INSERT INTO favorites (user_id, menu_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, menu_id) DO NOTHING
       RETURNING id, user_id, menu_id, created_at`,
      [userId, menu_id]
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'Makanan sudah ada di daftar favorit' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Gagal menambahkan favorit', error: error.message });
  }
});

// DELETE /api/v1/favorites/:menuId - Hapus makanan dari favorit
favoritesRouter.delete('/:menuId', async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.sub;
    const { menuId } = req.params;

    await query(
      'DELETE FROM favorites WHERE user_id = $1 AND menu_id = $2',
      [userId, menuId]
    );

    res.status(204).send();
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Gagal menghapus favorit', error: error.message });
  }
});
