import { Link } from "react-router-dom";
import { Star, Plus, Heart, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from "@shared/schema";

interface FoodCardProps {
  item: MenuItem;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, "");
}

export default function FoodCard({ item }: FoodCardProps) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  const isFav = isFavorite(item.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url || "/placeholder.svg",
    });
    toast({
      title: "Ditambahkan ke Keranjang",
      description: `${item.name} berhasil dimasukkan ke keranjang.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.id);
    toast({
      title: isFav ? "Dihapus dari Favorit" : "Ditambahkan ke Favorit",
      description: item.name,
    });
  };

  return (
    <Link
      to={`/menu/${item.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[#FFF3D6] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF3D6]/30">
        <img
          src={item.image_url || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=480&h=360&fit=crop";
          }}
        />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-[#3B2F2F] transition-all hover:scale-110"
          aria-label={isFav ? "Hapus favorit" : "Tambah favorit"}
        >
          <Heart
            className={`w-4 h-4 ${
              isFav ? "fill-[#F05A28] text-[#F05A28]" : "text-[#3B2F2F]/60"
            }`}
          />
        </button>

        {/* Rating Badge */}
        {item.rating > 0 && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-[#3B2F2F] shadow-sm">
            <Star className="w-3.5 h-3.5 fill-[#F6C445] text-[#F6C445]" />
            <span>{Number(item.rating).toFixed(1)}</span>
          </div>
        )}

        {/* Category tag */}
        {item.category_name && (
          <div className="absolute top-2.5 left-2.5 bg-[#8BC34A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {item.category_name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-[#3B2F2F] line-clamp-1 group-hover:text-[#F05A28] transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-[#3B2F2F]/70 line-clamp-2 mt-1 min-h-[32px]">
            {item.description || "Menu lezat pilihan GOMeal siap memanjakan lidah Anda."}
          </p>
        </div>

        {/* Preparation time & stock */}
        <div className="flex items-center gap-3 text-[11px] text-[#3B2F2F]/60 mt-2 mb-3">
          {item.preparation_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#F05A28]" />
              {item.preparation_time}
            </span>
          )}
          <span>Stok: {item.stock_quantity}</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-[#FFF3D6]">
          <span className="font-heading font-extrabold text-base text-[#F05A28]">
            {formatRupiah(item.price)}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-[#F05A28] hover:bg-[#F05A28]/90 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all"
            aria-label={`Tambah ${item.name} ke keranjang`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Pesan</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
