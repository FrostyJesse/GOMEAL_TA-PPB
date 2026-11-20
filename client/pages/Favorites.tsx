import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import FoodCard from "@/components/FoodCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { MenuItem } from "@shared/schema";

export default function Favorites() {
  const { isAuthenticated } = useAuth();

  const {
    data: favorites,
    isLoading,
    error,
  } = useQuery<any[]>({
    queryKey: ["user-favorites"],
    queryFn: () => api.getFavorites(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 fill-red-500" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#3B2F2F]">Makanan Favorit</h2>
          <p className="text-xs text-[#3B2F2F]/70">
            Silakan masuk ke akun Anda untuk melihat dan mengelola daftar makanan favorit Anda.
          </p>
          <Link
            to="/auth?redirect=/favorites"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F05A28] text-white font-bold text-xs rounded-xl hover:bg-[#F05A28]/90"
          >
            <span>Masuk Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#3B2F2F]">
            Makanan Favorit Saya
          </h1>
          <p className="text-xs text-[#3B2F2F]/70 mt-1">
            Kumpulan hidangan lezat yang pernah Anda tandai sebagai favorit.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F05A28]" />
            <p className="text-xs font-semibold text-[#3B2F2F]/70">Memuat makanan favorit...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && (!favorites || favorites.length === 0) && (
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#3B2F2F]">Belum Ada Favorit</h3>
            <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
              Anda belum menandai makanan sebagai favorit. Tekan tombol hati pada makanan yang Anda sukai!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F05A28] text-white font-heading font-bold text-xs rounded-2xl hover:bg-[#F05A28]/90 shadow-md transition-all"
            >
              <span>Jelajahi Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Favorites Grid */}
        {!isLoading && favorites && favorites.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {favorites.map((fav) => (
              <FoodCard
                key={fav.id}
                item={{
                  id: fav.menu_id,
                  name: fav.name,
                  price: fav.price,
                  image_url: fav.image_url,
                  category_id: fav.category_id || "",
                  category_name: fav.category_name,
                  rating: fav.rating || 0,
                  stock_quantity: 100,
                  is_available: true,
                  description: fav.description,
                  preparation_time: "15 menit",
                  created_at: fav.created_at,
                  updated_at: fav.created_at,
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
