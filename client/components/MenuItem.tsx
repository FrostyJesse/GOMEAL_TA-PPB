import { Heart, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from "@/context/FavoritesContext";
import LazyImage from "./LazyImage";

interface MenuItemProps {
  id?: string;
  name: string;
  price: string | number;
  image: string;
  imageRotation?: boolean;
  discount?: string;
  bgColor?: string;
}

export default function MenuItem({
  id = "",
  name,
  price,
  image,
  imageRotation = false,
  discount,
  bgColor = "#F6C445"
}: MenuItemProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();

  const isLiked = isFavorite(id || name);
  const numericPrice = typeof price === 'number' ? price : parseInt(String(price).replace(/[^0-9]/g, '') || '0', 10);

  const handleAddToCart = () => {
    if (!id) return;
    addToCart({ id, name, price: numericPrice, image_url: image });
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${name} telah dimasukkan ke keranjang.`,
    });
  };

  const handleToggleLike = () => {
    toggleFavorite(id || name);
    toast({
      title: isLiked ? "Dihapus dari favorit" : "Ditambahkan ke favorit",
      description: name,
    });
  };

  return (
    <div className="relative w-full max-w-[358px] mx-auto">
      {discount && (
        <div className="absolute -top-4 -right-4 z-10">
          <span className="font-heading font-extrabold text-xs px-2.5 py-1 rounded-full bg-[#F05A28] text-white shadow-sm">
            {discount}
          </span>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-[#FFF3D6] bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="w-full bg-white py-2 px-4 border-b border-[#FFF3D6]">
          <h3 className="font-heading font-bold text-base text-center text-[#3B2F2F] truncate">
            {name}
          </h3>
        </div>

        <div
          className="w-full overflow-hidden flex items-center justify-center p-4 bg-[#FFF3D6]/30"
        >
          <LazyImage
            src={image}
            alt={name}
            className={`w-auto max-w-full h-[160px] object-contain transition-transform duration-300 hover:scale-105 ${
              imageRotation ? "rotate-6" : ""
            }`}
          />
        </div>

        <div className="w-full bg-white py-3 px-4 flex items-center justify-between border-t border-[#FFF3D6]">
          <span className="font-heading font-extrabold text-base text-[#F05A28]">
            {typeof price === 'number' ? `Rp${price.toLocaleString('id-ID')}` : price}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLike}
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 transition-colors flex items-center justify-center border border-gray-100"
              aria-label="Sukai"
            >
              <Heart
                size={16}
                className={isLiked ? "fill-[#F05A28] stroke-[#F05A28]" : "stroke-[#3B2F2F]/60"}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-8 h-8 rounded-full bg-[#F05A28] hover:bg-[#F05A28]/90 flex items-center justify-center transition-colors shadow-sm"
              aria-label="Tambah ke keranjang"
            >
              <Plus size={16} className="text-white" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
