import { Link } from "react-router-dom";
import { ChevronRight, Calendar, Package } from "lucide-react";
import { formatRupiah } from "./FoodCard";
import type { Order, OrderStatus } from "@shared/schema";
import { ORDER_STATUS_LABELS } from "@shared/schema";

interface OrderCardProps {
  order: Order & { items?: any[] };
}

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  menunggu_konfirmasi: { bg: "bg-yellow-50", text: "text-amber-700", border: "border-amber-200" },
  diproses: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  sedang_diantar: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  selesai: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  dibatalkan: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export default function OrderCard({ order }: OrderCardProps) {
  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.menunggu_konfirmasi;
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  const dateFormatted = new Date(order.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const firstItem = order.items?.[0];
  const itemsCount = order.items?.length || 0;

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white rounded-2xl border border-[#FFF3D6] p-4 shadow-sm hover:shadow-md transition-all hover:border-[#F6C445]"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#FFF3D6]">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#F05A28]" />
          <span className="font-mono text-xs text-[#3B2F2F]/60">
            #{order.id.slice(0, 8)}...
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {firstItem?.image_url && (
            <img
              src={firstItem.image_url}
              alt={firstItem.item_name}
              className="w-14 h-14 rounded-xl object-cover bg-[#FFF3D6]/40"
            />
          )}
          <div>
            <h4 className="font-bold text-sm text-[#3B2F2F]">
              {firstItem?.item_name || "Pesanan Makanan"}
            </h4>
            <p className="text-xs text-[#3B2F2F]/60 mt-0.5">
              {itemsCount > 1
                ? `dan ${itemsCount - 1} item lainnya (${order.items?.reduce((acc, i) => acc + i.quantity, 0)} porsi)`
                : `${firstItem?.quantity || 1} porsi`}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#3B2F2F]/50 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{dateFormatted}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#3B2F2F]/40" />
      </div>

      <div className="pt-3 border-t border-[#FFF3D6] flex items-center justify-between">
        <span className="text-xs text-[#3B2F2F]/70">Total Belanja</span>
        <span className="font-heading font-extrabold text-sm text-[#F05A28]">
          {formatRupiah(order.total_price)}
        </span>
      </div>
    </Link>
  );
}
