/** API response types shared between client and server */

export interface DemoResponse {
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  errors?: { field?: string; message: string }[];
}

export interface LoginResponse {
  token: string;
  role: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface RegisterResponse {
  id: string;
  email: string;
  username: string;
}

export interface CreateOrderResponse {
  order_id: string;
  message: string;
}
