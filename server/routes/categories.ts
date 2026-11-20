import { Router } from 'express';
import { query } from '../lib/db';

export const categoriesRouter = Router();

// GET /api/v1/categories
categoriesRouter.get('/', async (_req, res) => {
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
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Gagal mengambil kategori', error: error.message });
  }
});
