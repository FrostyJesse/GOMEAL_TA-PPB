import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favoriteIds: Set<string>;
  toggleFavorite: (menuId: string) => Promise<void>;
  isFavorite: (menuId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('gomeal_favorites');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await api.getFavorites();
      const ids = new Set(data.map((f: any) => f.menu_id));
      setFavoriteIds(ids);
      localStorage.setItem('gomeal_favorites', JSON.stringify(Array.from(ids)));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (menuId: string) => {
    const isCurrentlyFav = favoriteIds.has(menuId);
    const updated = new Set(favoriteIds);

    if (isCurrentlyFav) {
      updated.delete(menuId);
    } else {
      updated.add(menuId);
    }
    setFavoriteIds(updated);
    localStorage.setItem('gomeal_favorites', JSON.stringify(Array.from(updated)));

    if (isAuthenticated) {
      try {
        if (isCurrentlyFav) {
          await api.removeFavorite(menuId);
        } else {
          await api.addFavorite(menuId);
        }
      } catch (err) {
        console.error('Error syncing favorite with server:', err);
      }
    }
  };

  const isFavorite = (menuId: string) => favoriteIds.has(menuId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
