import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CreditCard,
  Package,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Header from "@/components/Header";
import { formatRupiah } from "@/components/FoodCard";
import { STATUS_COLORS } from "@/components/OrderCard";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import type { OrderWithItems, OrderStatus } from "@shared/schema";
import { ORDER_STATUS_LABELS } from "@shared/schema";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isCancelling, setIsCancelling] = useState(false);

  const {
    data: order,
    isLoading,
    error,
  } = useQuery<OrderWithItems>({
    queryKey: ["order-detail", id],
    queryFn: () => api.getOrder(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => api.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      toast({
        title: "Pesanan Dibatalkan",
        description: "Pesanan Anda berhasil dibatalkan.",
      });
      setIsCancelling(false);
    },
    onError: (err: any) => {
      toast({
        title: "Gagal Membatalkan",
        description: err.message || "Pesanan tidak dapat dibatalkan.",
        variant: "destructive",
      });
      setIsCancelling(false);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#F05A28]" />
          <p className="text-xs font-semibold text-[#3B2F2F]/70">Memuat rincian pesanan...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="font-heading font-bold text-xl text-[#3B2F2F]">Pesanan Tidak Ditemukan</h2>
          <p className="text-xs text-[#3B2F2F]/70">
            Pesanan tidak tersedia atau Anda tidak memiliki akses untuk melihatnya.
          </p>
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="px-6 py-2.5 bg-[#F05A28] text-white font-bold text-xs rounded-xl"
          >
            Kembali ke Pesanan
          </button>
        </main>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[order.status] || STATUS_COLORS.menunggu_konfirmasi;
  const statusLabel = ORDER_STATUS_LABELS[order.status] || order.status;

  const dateFormatted = new Date(order.created_at).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const canCancel = order.status === "menunggu_konfirmasi";

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B2F2F]/80 hover:text-[#F05A28] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Riwayat Pesanan</span>
        </button>

        {/* Status Header Banner */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#3B2F2F]/60">Nomor Pesanan</span>
              <h1 className="font-mono font-bold text-base text-[#3B2F2F]">#{order.id}</h1>
              <p className="text-xs text-[#3B2F2F]/60 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{dateFormatted}</span>
              </p>
            </div>
            <span
              className={`self-start sm:self-auto text-xs font-extrabold px-3 py-1.5 rounded-full border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Progress Timeline */}
          {order.status !== "dibatalkan" && (
            <div className="pt-4 border-t border-[#FFF3D6]">
              <div className="grid grid-cols-4 text-center gap-2">
                <div className="space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      ["menunggu_konfirmasi", "diproses", "sedang_diantar", "selesai"].includes(order.status)
                        ? "bg-[#8BC34A] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-[10px] font-bold text-[#3B2F2F] block">Dikonfirmasi</span>
                </div>

                <div className="space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      ["diproses", "sedang_diantar", "selesai"].includes(order.status)
                        ? "bg-[#8BC34A] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-[10px] font-bold text-[#3B2F2F] block">Diproses</span>
                </div>

                <div className="space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      ["sedang_diantar", "selesai"].includes(order.status)
                        ? "bg-[#8BC34A] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-[10px] font-bold text-[#3B2F2F] block">Diantar</span>
                </div>

                <div className="space-y-1">
                  <div
                    className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                      order.status === "selesai"
                        ? "bg-[#8BC34A] text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    4
                  </div>
                  <span className="text-[10px] font-bold text-[#3B2F2F] block">Selesai</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items List Card */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-base text-[#3B2F2F]">Daftar Makanan</h3>

          <div className="divide-y divide-[#FFF3D6]">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.item_name}
                      className="w-14 h-14 rounded-xl object-cover bg-[#FFF3D6]/40"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-[#3B2F2F]">{item.item_name}</h4>
                    <p className="text-xs text-[#3B2F2F]/60 mt-0.5">
                      {item.quantity} x {formatRupiah(item.unit_price)}
                    </p>
                  </div>
                </div>
                <span className="font-heading font-bold text-sm text-[#3B2F2F]">
                  {formatRupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pengiriman */}
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3B2F2F]">
              <MapPin className="w-4 h-4 text-[#F05A28]" />
              <span>Alamat Pengiriman</span>
            </div>
            <p className="font-bold text-sm text-[#3B2F2F]">{order.recipient_name}</p>
            <p className="text-xs text-[#3B2F2F]/60">{order.recipient_phone}</p>
            <p className="text-xs text-[#3B2F2F]/80 mt-1">{order.delivery_address}</p>
            {order.customer_note && (
              <p className="text-xs italic text-[#3B2F2F]/60 pt-2 border-t border-[#FFF3D6]">
                Catatan: "{order.customer_note}"
              </p>
            )}
          </div>

          {/* Pembayaran */}
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3B2F2F]">
              <CreditCard className="w-4 h-4 text-[#F05A28]" />
              <span>Metode Pembayaran</span>
            </div>
            <p className="font-bold text-sm uppercase text-[#3B2F2F]">
              {order.payment_method.replace("_", " ")}
            </p>
            <div className="pt-3 space-y-1.5 text-xs text-[#3B2F2F]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Kirim</span>
                <span>{formatRupiah(order.delivery_fee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#8BC34A] font-bold">
                  <span>Diskon</span>
                  <span>-{formatRupiah(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#F05A28] pt-2 border-t border-[#FFF3D6]">
                <span>Total Bayar</span>
                <span>{formatRupiah(order.total_price)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action: Cancel order if allowed */}
        {canCancel && (
          <div className="pt-2 text-center">
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => {
                if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
                  setIsCancelling(true);
                  cancelMutation.mutate(order.id);
                }
              }}
              className="px-6 py-2.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold transition-all disabled:opacity-50"
            >
              {isCancelling ? "Membatalkan..." : "Batalkan Pesanan"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
