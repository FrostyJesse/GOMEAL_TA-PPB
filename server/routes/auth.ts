import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from '../lib/db';
import { registerSchema, loginSchema } from '../../shared/schema';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gomeal_secure_jwt_secret_2024_xK9mP2nQ7wR4tY6u';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = registerSchema.parse(req.body);

    // Cek apakah email atau username sudah terdaftar
    const existing = await query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2 LIMIT 1',
      [email, username]
    );

    if (existing.rows.length > 0) {
      const match = existing.rows[0];
      if (match.email === email) {
        return res.status(409).json({ message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' });
      }
      return res.status(409).json({ message: 'Username sudah digunakan. Silakan pilih username lain.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user baru
    const result = await query(
      `INSERT INTO users (email, username, password_hash, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, email, username, role, created_at`,
      [email, username, password_hash]
    );

    const newUser = result.rows[0];

    // Otomatis buat profil kosong
    await query(
      `INSERT INTO profiles (id, full_name, phone, address)
       VALUES ($1, $2, '', '')
       ON CONFLICT (id) DO NOTHING`,
      [newUser.id, username]
    );

    res.status(201).json({
      message: 'Registrasi berhasil. Silakan login.',
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validasi gagal', errors: error.errors });
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat mendaftar.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = loginSchema.parse(req.body);

    // Cari berdasarkan email ATAU username
    const result = await query(
      'SELECT id, email, username, password_hash, role FROM users WHERE email = $1 OR username = $1 LIMIT 1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email/Username atau password salah.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email/Username atau password salah.' });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validasi gagal', errors: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat login.' });
  }
});

// GET /api/auth/me (Cek status autentikasi token)
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.sub;
    const result = await query(
      `SELECT u.id, u.email, u.username, u.role, u.created_at,
              p.full_name, p.phone, p.avatar_url, p.address
       FROM users u
       LEFT JOIN profiles p ON u.id = p.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Auth /me error:', error);
    res.status(500).json({ message: 'Gagal mengambil data user.' });
  }
});

export const authRoutes = router;
