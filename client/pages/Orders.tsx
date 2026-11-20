import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import OrderCard from "@/components/OrderCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { Order } from "@shared/schema";

export default function Orders() {
  const { isAuthenticated } = useAuth();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Order[]>({
    queryKey: ["user-orders"],
    queryFn: () => api.getOrders(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF3D6] flex items-center justify-center mx-auto text-[#F05A28]">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#3B2F2F]">Riwayat Pesanan</h2>
          <p className="text-xs text-[#3B2F2F]/70">
            Silakan masuk ke akun Anda terlebih dahulu untuk melihat daftar dan status pesanan.
          </p>
          <Link
            to="/auth?redirect=/orders"
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

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#3B2F2F]">
            Pesanan Saya
          </h1>
          <p className="text-xs text-[#3B2F2F]/70 mt-1">
            Lacak status pengiriman makanan dan lihat riwayat transaksi Anda.
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#F05A28]" />
            <p className="text-xs font-semibold text-[#3B2F2F]/70">Memuat riwayat pesanan...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && orders?.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFF3D6] flex items-center justify-center mx-auto text-[#F05A28]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#3B2F2F]">Belum Ada Pesanan</h3>
            <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
              Anda belum pernah memesan makanan di GOMeal. Yuk, pesan sekarang dan nikmati kelezatan makanannya!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F05A28] text-white font-heading font-bold text-xs rounded-2xl hover:bg-[#F05A28]/90 shadow-md transition-all"
            >
              <span>Pesan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && orders && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
