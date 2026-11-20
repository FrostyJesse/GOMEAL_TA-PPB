import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Banknote, QrCode, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { formatRupiah } from "@/components/FoodCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, discount, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [recipientName, setRecipientName] = useState(user?.full_name || user?.username || "");
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || "");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "transfer_bank" | "qris">("cod");
  const [loading, setLoading] = useState(false);

  // Jika keranjang kosong, arahkan ke menu
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <h2 className="font-heading font-bold text-xl text-[#3B2F2F]">Keranjang Anda Kosong</h2>
          <p className="text-xs text-[#3B2F2F]/70">Silakan pilih makanan terlebih dahulu sebelum checkout.</p>
          <Link
            to="/menu"
            className="inline-block px-6 py-2.5 bg-[#F05A28] text-white font-bold text-xs rounded-xl"
          >
            Lihat Menu
          </Link>
        </main>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Perlu Login",
        description: "Silakan login terlebih dahulu untuk menyelesaikan pesanan.",
        variant: "destructive",
      });
      navigate("/auth?redirect=/checkout");
      return;
    }

    if (!recipientName.trim() || !recipientPhone.trim() || !deliveryAddress.trim()) {
      toast({
        title: "Data Belum Lengkap",
        description: "Mohon isi nama, nomor telepon, dan alamat pengiriman.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        delivery_address: deliveryAddress.trim(),
        customer_note: customerNote.trim() || undefined,
        payment_method: paymentMethod,
        items: items.map((i) => ({
          menu_id: i.id,
          quantity: i.quantity,
        })),
      };

      const result = await api.createOrder(payload);

      // Kosongkan keranjang setelah transaksi berhasil
      clearCart();

      toast({
        title: "Pesanan Berhasil!",
        description: "Pesanan Anda telah diterima dan sedang diproses.",
      });

      // Arahkan ke detail pesanan
      navigate(`/orders/${result.order_id}`);
    } catch (err: any) {
      toast({
        title: "Gagal Membuat Pesanan",
        description: err.message || "Terjadi kesalahan saat memproses pesanan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B2F2F]/80 hover:text-[#F05A28] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang</span>
        </button>

        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#3B2F2F]">
          Checkout Pesanan
        </h1>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form: Delivery details & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Form Card */}
            <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-[#3B2F2F]">
                Informasi Pengiriman
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                    Nama Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                    Nomor WhatsApp / Telepon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="Contoh: 08123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={3}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, patokan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Catatan untuk Restoran / Kurir (Opsional)
                </label>
                <input
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Contoh: Jangan terlalu pedas, sambal dipisah..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selection Card */}
            <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-[#3B2F2F]">
                Metode Pembayaran
              </h3>

              <div className="space-y-3">
                {/* Option 1: COD */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#F05A28] bg-[#FFF3D6]/40 ring-1 ring-[#F05A28]"
                      : "border-[#FFF3D6] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8BC34A]/20 text-[#8BC34A] flex items-center justify-center">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3B2F2F]">Cash on Delivery (COD)</p>
                      <p className="text-xs text-[#3B2F2F]/60">Bayar langsung saat makanan tiba</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 text-[#F05A28] focus:ring-[#F05A28]"
                  />
                </label>

                {/* Option 2: Transfer Bank */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "transfer_bank"
                      ? "border-[#F05A28] bg-[#FFF3D6]/40 ring-1 ring-[#F05A28]"
                      : "border-[#FFF3D6] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F6C445]/30 text-[#3B2F2F] flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3B2F2F]">Transfer Bank (Simulasi)</p>
                      <p className="text-xs text-[#3B2F2F]/60">BCA, Mandiri, BRI, BNI</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="transfer_bank"
                    checked={paymentMethod === "transfer_bank"}
                    onChange={() => setPaymentMethod("transfer_bank")}
                    className="w-4 h-4 text-[#F05A28] focus:ring-[#F05A28]"
                  />
                </label>

                {/* Option 3: QRIS */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === "qris"
                      ? "border-[#F05A28] bg-[#FFF3D6]/40 ring-1 ring-[#F05A28]"
                      : "border-[#FFF3D6] hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F05A28]/20 text-[#F05A28] flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#3B2F2F]">QRIS Instant (Simulasi)</p>
                      <p className="text-xs text-[#3B2F2F]/60">Scan menggunakan e-wallet atau m-banking</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="qris"
                    checked={paymentMethod === "qris"}
                    onChange={() => setPaymentMethod("qris")}
                    className="w-4 h-4 text-[#F05A28] focus:ring-[#F05A28]"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm sticky top-24 space-y-4">
              <h3 className="font-heading font-bold text-base text-[#3B2F2F] pb-3 border-b border-[#FFF3D6]">
                Ringkasan Pesanan
              </h3>

              {/* Items summary */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="truncate pr-2">
                      <span className="font-bold text-[#3B2F2F]">{item.quantity}x</span>{" "}
                      <span className="text-[#3B2F2F]/80">{item.name}</span>
                    </div>
                    <span className="font-semibold text-[#3B2F2F] whitespace-nowrap">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-3 border-t border-[#FFF3D6] text-xs text-[#3B2F2F]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#3B2F2F]">{formatRupiah(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span className="font-bold text-[#3B2F2F]">{formatRupiah(deliveryFee)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#8BC34A] font-bold">
                    <span>Diskon</span>
                    <span>-{formatRupiah(discount)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#FFF3D6] flex justify-between items-center">
                <span className="text-xs text-[#3B2F2F]/70">Total Bayar</span>
                <span className="font-heading font-extrabold text-xl text-[#F05A28]">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#F05A28] text-white font-heading font-bold text-sm hover:bg-[#F05A28]/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses Pesanan...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Konfirmasi Pesanan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
