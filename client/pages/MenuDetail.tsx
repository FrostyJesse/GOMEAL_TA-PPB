import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Star,
  Clock,
  Package,
  Plus,
  Minus,
  Heart,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import { formatRupiah } from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import type { MenuItem } from "@shared/schema";

export default function MenuDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);

  const {
    data: item,
    isLoading,
    error,
  } = useQuery<MenuItem>({
    queryKey: ["menu-detail", id],
    queryFn: () => api.getMenuItem(id!),
    enabled: !!id,
  });

  const isFav = id ? isFavorite(id) : false;

  const handleAddToCart = () => {
    if (!item) return;
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url || "/placeholder.svg",
      },
      quantity
    );
    toast({
      title: "Berhasil Ditambahkan",
      description: `${quantity}x ${item.name} dimasukkan ke keranjang.`,
    });
  };

  const handleOrderNow = () => {
    if (!item) return;
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image_url: item.image_url || "/placeholder.svg",
      },
      quantity
    );
    navigate("/checkout");
  };

  const handleToggleFav = () => {
    if (!item) return;
    toggleFavorite(item.id);
    toast({
      title: isFav ? "Dihapus dari Favorit" : "Ditambahkan ke Favorit",
      description: item.name,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-[#F05A28] mb-3" />
          <p className="text-sm font-semibold text-[#3B2F2F]/70">Memuat detail makanan...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#3B2F2F]">Makanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#3B2F2F]/70">
            Menu yang Anda cari mungkin telah dihapus atau ID tidak valid.
          </p>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="px-6 py-2.5 bg-[#F05A28] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#F05A28]/90"
          >
            Kembali ke Menu
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-16">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B2F2F]/80 hover:text-[#F05A28] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        <div className="bg-white rounded-3xl border border-[#FFF3D6] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Large Image Column */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FFF3D6]/30">
            <img
              src={item.image_url || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop";
              }}
            />

            {/* Favorite button */}
            <button
              type="button"
              onClick={handleToggleFav}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md text-[#3B2F2F] hover:scale-110 active:scale-95 transition-all"
              aria-label={isFav ? "Hapus dari favorit" : "Tambah ke favorit"}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav ? "fill-[#F05A28] text-[#F05A28]" : "text-[#3B2F2F]/60"
                }`}
              />
            </button>

            {/* Category badge */}
            {item.category_name && (
              <span className="absolute top-4 left-4 bg-[#8BC34A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {item.category_name}
              </span>
            )}
          </div>

          {/* Details & Actions Column */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1 bg-[#F6C445]/30 px-2 py-0.5 rounded-full text-xs font-bold text-[#3B2F2F]">
                    <Star className="w-3.5 h-3.5 fill-[#F6C445] text-[#F6C445]" />
                    <span>{Number(item.rating).toFixed(1)} / 5.0</span>
                  </div>
                  <span className="text-xs text-[#8BC34A] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tersedia
                  </span>
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#3B2F2F]">
                  {item.name}
                </h1>
                <p className="font-heading font-extrabold text-2xl text-[#F05A28] mt-2">
                  {formatRupiah(item.price)}
                </p>
              </div>

              {/* Badges: Prep time, Stock */}
              <div className="flex items-center gap-4 py-3 border-y border-[#FFF3D6] text-xs text-[#3B2F2F]/80">
                {item.preparation_time && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#F05A28]" />
                    <span>Waktu: {item.preparation_time}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#8BC34A]" />
                  <span>Stok: {item.stock_quantity} porsi</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-heading font-bold text-sm text-[#3B2F2F] mb-1">Deskripsi</h3>
                <p className="text-xs sm:text-sm text-[#3B2F2F]/80 leading-relaxed">
                  {item.description ||
                    "Hidangan istimewa racikan chef GOMeal dengan bahan-bahan pilihan berkualitas tinggi yang segar dan lezat."}
                </p>
              </div>
            </div>

            {/* Quantity Controls & Order Buttons */}
            <div className="space-y-4 pt-4 border-t border-[#FFF3D6]">
              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3B2F2F]">Jumlah Pesanan:</span>
                <div className="flex items-center bg-[#FFF3D6] rounded-xl border border-[#F6C445]/50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 hover:bg-[#F6C445]/40 rounded-lg text-[#3B2F2F] disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-heading font-bold text-sm text-[#3B2F2F]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(item.stock_quantity, q + 1))}
                    disabled={quantity >= item.stock_quantity}
                    className="p-1.5 hover:bg-[#F6C445]/40 rounded-lg text-[#3B2F2F] disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtotal calculation */}
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#3B2F2F]/70">Subtotal:</span>
                <span className="font-heading font-extrabold text-base text-[#F05A28]">
                  {formatRupiah(item.price * quantity)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#F6C445] text-[#3B2F2F] font-heading font-bold text-xs sm:text-sm hover:bg-[#F6C445]/90 active:scale-95 transition-all shadow-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>
                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#F05A28] text-white font-heading font-bold text-xs sm:text-sm hover:bg-[#F05A28]/90 active:scale-95 transition-all shadow-sm"
                >
                  <span>Pesan Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
