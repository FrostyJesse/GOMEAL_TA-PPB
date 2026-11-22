import { Router } from 'express';
import { query } from '../lib/db';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { profileSchema } from '../../shared/schema';
import { z } from 'zod';

export const profileRouter = Router();

profileRouter.use(authMiddleware);

// GET /api/v1/profile
profileRouter.get('/', async (req: any, res: any) => {
  try {
    const userId = req.user!.sub;

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
      return res.status(404).json({ message: 'Profil tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Gagal mengambil data profil', error: error.message });
  }
});

// PUT /api/v1/profile
profileRouter.put('/', async (req: any, res: any) => {
  try {
    const userId = req.user!.sub;
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
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validasi profil gagal', errors: error.errors });
    }
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Gagal memperbarui profil', error: error.message });
  }
});
