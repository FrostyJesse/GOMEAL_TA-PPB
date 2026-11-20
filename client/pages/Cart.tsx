import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import CartItem from "@/components/CartItem";
import { formatRupiah } from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, subtotal, deliveryFee, discount, totalPrice } =
    useCart();

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Title & Clear Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#3B2F2F]">
              Keranjang Belanja
            </h1>
            <p className="text-xs text-[#3B2F2F]/70 mt-1">
              Periksa makanan pilihan Anda sebelum melanjutkan ke checkout.
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Kosongkan</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-[#FFF3D6] flex items-center justify-center mx-auto text-[#F05A28]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="font-heading font-bold text-xl text-[#3B2F2F]">Keranjang Masih Kosong</h3>
            <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
              Anda belum menambahkan makanan ke dalam keranjang. Yuk, cari menu favoritmu sekarang!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F05A28] text-white font-heading font-bold text-xs rounded-2xl hover:bg-[#F05A28]/90 shadow-md transition-all"
            >
              <span>Jelajahi Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Summary card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm sticky top-24 space-y-4">
                <h3 className="font-heading font-bold text-lg text-[#3B2F2F] pb-3 border-b border-[#FFF3D6]">
                  Ringkasan Pesanan
                </h3>

                <div className="space-y-2.5 text-xs text-[#3B2F2F]/80">
                  <div className="flex justify-between">
                    <span>Jumlah Item</span>
                    <span className="font-bold text-[#3B2F2F]">{totalItems} porsi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#3B2F2F]">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span className="font-bold text-[#3B2F2F]">{formatRupiah(deliveryFee)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#8BC34A] font-bold">
                      <span>Diskon (10%)</span>
                      <span>-{formatRupiah(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#FFF3D6] flex justify-between items-center">
                  <div>
                    <span className="text-xs text-[#3B2F2F]/70 block">Total Pembayaran</span>
                    <span className="font-heading font-extrabold text-xl text-[#F05A28]">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#F05A28] text-white font-heading font-bold text-sm hover:bg-[#F05A28]/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Lanjut ke Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
