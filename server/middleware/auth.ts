import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'gomeal_secure_jwt_secret_2024_xK9mP2nQ7wR4tY6u';

export interface AuthenticatedUser {
  sub: string;
  role: 'user' | 'admin';
  email?: string;
  username?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  headers: any;
  params: any;
  body: any;
  query: any;
  [key: string]: any;
}

export const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers?.authorization;
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Token otentikasi tidak ditemukan. Silakan login terlebih dahulu.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    if (typeof next === 'function') next();
  } catch (error) {
    return res.status(401).json({ message: 'Sesi login telah kedaluwarsa atau token tidak valid.' });
  }
};

export const requireAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Tindakan ini memerlukan hak akses Admin.' });
  }
  if (typeof next === 'function') next();
};
