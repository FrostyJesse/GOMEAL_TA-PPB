import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: 'user' | 'admin' | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profileData = await api.getProfile();
      setUser({
        id: profileData.id,
        email: profileData.email,
        username: profileData.username,
        role: (profileData as any).role || 'user',
        full_name: profileData.full_name || undefined,
        phone: profileData.phone || undefined,
        avatar_url: profileData.avatar_url || undefined,
        address: profileData.address || undefined,
      });
    } catch (err) {
      console.warn('Sesi login kedaluwarsa:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (identifier: string, password: string) => {
    const res = await api.login({ identifier, password });
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    setToken(res.token);
    await refreshUser();
  };

  const register = async (email: string, username: string, password: string) => {
    await api.register({ email, username, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || (localStorage.getItem('role') as any) || null,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
