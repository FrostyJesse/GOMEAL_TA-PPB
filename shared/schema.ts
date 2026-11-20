import { z } from 'zod';

// ============================================
// Zod Validation Schemas
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const checkoutSchema = z.object({
  recipient_name: z.string().min(1, 'Nama penerima wajib diisi'),
  recipient_phone: z.string().min(1, 'Nomor telepon wajib diisi'),
  delivery_address: z.string().min(1, 'Alamat pengiriman wajib diisi'),
  customer_note: z.string().optional().default(''),
  payment_method: z.enum(['cod', 'transfer_bank', 'qris'], {
    required_error: 'Pilih metode pembayaran',
  }),
  items: z.array(z.object({
    menu_id: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1, 'Keranjang tidak boleh kosong'),
});

export const profileSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
});

// ============================================
// TypeScript Interfaces
// ============================================

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends User {
  profile?: Profile;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock_quantity: number;
  is_available: boolean;
  rating: number;
  preparation_time: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export type OrderStatus =
  | 'menunggu_konfirmasi'
  | 'diproses'
  | 'sedang_diantar'
  | 'selesai'
  | 'dibatalkan';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  diproses: 'Diproses',
  sedang_diantar: 'Sedang Diantar',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_price: number;
  recipient_name: string;
  recipient_phone: string;
  delivery_address: string;
  customer_note: string | null;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string | null;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface Favorite {
  id: string;
  user_id: string;
  menu_id: string;
  created_at: string;
  menu?: MenuItem;
}

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
