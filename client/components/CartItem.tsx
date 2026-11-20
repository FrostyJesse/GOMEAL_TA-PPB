import { Minus, Plus, Trash2 } from "lucide-react";
import { formatRupiah } from "./FoodCard";
import type { CartItemType } from "@shared/schema";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#FFF3D6] shadow-sm">
      {/* Gambar */}
      <img
        src={item.image_url || "/placeholder.svg"}
        alt={item.name}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#FFF3D6]/30 flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop";
        }}
      />

      {/* Info Makanan */}
      <div className="flex-1 min-w-0">
        <h4 className="font-heading font-bold text-sm text-[#3B2F2F] truncate">
          {item.name}
        </h4>
        <p className="font-heading font-extrabold text-sm text-[#F05A28] mt-0.5">
          {formatRupiah(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center bg-[#FFF3D6]/60 rounded-xl border border-[#F6C445]/40 p-0.5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="p-1 hover:bg-[#F6C445]/30 rounded-lg text-[#3B2F2F] transition-colors"
              aria-label="Kurangi kuantitas"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-bold text-xs text-[#3B2F2F]">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="p-1 hover:bg-[#F6C445]/30 rounded-lg text-[#3B2F2F] transition-colors"
              aria-label="Tambah kuantitas"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-xs text-[#3B2F2F]/60">
            Subtotal: {formatRupiah(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors self-start"
        aria-label={`Hapus ${item.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
