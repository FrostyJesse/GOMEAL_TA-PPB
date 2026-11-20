import type { MenuItem, Category, Order, OrderWithItems, Profile, Favorite } from '@shared/schema';
import type { PaginatedResponse, LoginResponse, RegisterResponse, CreateOrderResponse } from '@shared/api';

async function fetchAPI<T = any>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Terjadi kesalahan pada server' }));
    throw new Error(error.message || `HTTP Error ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json();
}

export const api = {
  // Health
  healthCheck: () => fetchAPI<{ status: string }>('/api/health'),

  // Auth
  login: (data: { identifier: string; password: string }) =>
    fetchAPI<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data: { email: string; username: string; password: string }) =>
    fetchAPI<RegisterResponse>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Menu
  getMenuItems: (params?: { category?: string; search?: string; page?: number; limit?: number; sort?: string }) => {
    const sp = new URLSearchParams();
    if (params?.category && params.category !== 'Semua') sp.set('category', params.category);
    if (params?.search) sp.set('search', params.search);
    if (params?.page) sp.set('page', String(params.page));
    if (params?.limit) sp.set('limit', String(params.limit));
    if (params?.sort) sp.set('sort', params.sort);
    return fetchAPI<PaginatedResponse<MenuItem>>(`/api/v1/menu?${sp.toString()}`);
  },

  getMenuItem: (id: string) => fetchAPI<MenuItem>(`/api/v1/menu/${id}`),

  // Categories
  getCategories: () => fetchAPI<Category[]>('/api/v1/categories'),

  // Orders
  getOrders: () => fetchAPI<Order[]>('/api/v1/orders'),
  getOrder: (id: string) => fetchAPI<OrderWithItems>(`/api/v1/orders/${id}`),
  createOrder: (data: {
    recipient_name: string;
    recipient_phone: string;
    delivery_address: string;
    customer_note?: string;
    payment_method: string;
    items: { menu_id: string; quantity: number }[];
  }) => fetchAPI<CreateOrderResponse>('/api/v1/orders', { method: 'POST', body: JSON.stringify(data) }),
  cancelOrder: (id: string) =>
    fetchAPI<{ message: string }>(`/api/v1/orders/${id}/cancel`, { method: 'PATCH' }),

  // Profile
  getProfile: () => fetchAPI<Profile & { email: string; username: string }>('/api/v1/profile'),
  updateProfile: (data: { full_name?: string; phone?: string; avatar_url?: string; address?: string }) =>
    fetchAPI<Profile>('/api/v1/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Favorites
  getFavorites: () => fetchAPI<Favorite[]>('/api/v1/favorites'),
  addFavorite: (menuId: string) =>
    fetchAPI<{ id: string }>('/api/v1/favorites', { method: 'POST', body: JSON.stringify({ menu_id: menuId }) }),
  removeFavorite: (menuId: string) =>
    fetchAPI<null>(`/api/v1/favorites/${menuId}`, { method: 'DELETE' }),
};
