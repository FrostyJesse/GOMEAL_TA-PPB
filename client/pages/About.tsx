import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  UtensilsCrossed,
  GraduationCap,
} from "lucide-react";
import Header from "@/components/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function About() {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-24">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B2F2F]/80 hover:text-[#F05A28] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#F6C445] via-[#F6C445]/90 to-[#F05A28] rounded-3xl p-8 sm:p-10 text-center text-[#3B2F2F] shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/95 shadow-md flex items-center justify-center mx-auto text-[#F05A28] font-heading font-extrabold text-2xl">
            GO
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#3B2F2F]">GOMeal</h1>
          <p className="font-heading font-extrabold text-base sm:text-lg text-white tracking-wide">
            "Good Food, Good Mood!"
          </p>
          <p className="text-xs sm:text-sm text-[#3B2F2F]/85 max-w-lg mx-auto leading-relaxed pt-2">
            GOMeal adalah aplikasi pemesanan makanan modern yang dirancang untuk memberikan pengalaman memesan hidangan favorit secara praktis, nyaman, dan menyenangkan langsung dari genggaman Anda.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 hover:bg-white text-[#F05A28] font-heading font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Info Tugas Akhir & NIM</span>
            </button>
          </div>
        </div>

        {/* Cerita & Komitmen Kami */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#F05A28]">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-heading font-bold text-lg text-[#3B2F2F]">Tentang GOMeal</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3B2F2F]/80 leading-relaxed">
            Kami percaya bahwa makanan lezat memiliki kekuatan untuk membangkitkan suasana hati terbaik dalam setiap momen. Melalui platform GOMeal, kami berdedikasi menghubungkan penikmat kuliner dengan aneka pilihan menu hidangan berkualitas, disajikan segar, dan diantar dengan aman serta higienis.
          </p>
        </div>

        {/* 3 Pilar Komitmen Layanan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3D6] text-[#F05A28] flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#3B2F2F]">Cita Rasa Terbaik</h3>
            <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
              Resep pilihan dengan bahan-bahan segar berkualitas tinggi di setiap hidangan.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3D6] text-[#8BC34A] flex items-center justify-center mx-auto">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#3B2F2F]">Cepat & Tepat Waktu</h3>
            <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
              Pengiriman sigap agar makanan tetap hangat dan lezat saat sampai di tangan Anda.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-5 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF3D6] text-[#F05A28] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-[#3B2F2F]">Higienis & Terpercaya</h3>
            <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
              Standar kebersihan terjamin serta proses transaksi yang aman dan transparan.
            </p>
          </div>
        </div>

        {/* Fitur Utama */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#8BC34A]">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="font-heading font-bold text-lg text-[#3B2F2F]">Fitur Utama Aplikasi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3B2F2F]/80">
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2.5">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Eksplorasi Katalog Menu:</strong> Pencarian cepat, filter kategori, dan pengurutan harga maupun popularitas.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2.5">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Detail Menu Lengkap:</strong> Informasi stok real-time, estimasi waktu masak, rating, dan foto memikat.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2.5">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Keranjang & Checkout Mudah:</strong> Pengaturan kuantitas instan, diskon otomatis, dan pilihan pembayaran fleksibel.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2.5">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Pelacakan Status Pesanan:</strong> Timeline progres 4 tahap pesanan secara interaktif dan transparan.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2.5">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Menu Favorit:</strong> Simpan hidangan kesukaan Anda untuk pemesanan ulang yang lebih praktis.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2.5">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Navigasi Mobile-First:</strong> Bottom Navigation Bar intuitif yang nyaman diakses melalui perangkat ponsel.</span>
            </div>
          </div>
        </div>

        {/* CTA Banner Section */}
        <div className="bg-gradient-to-r from-[#F05A28] to-[#F6C445] rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-extrabold text-xl text-white">Perut Lapar? GOMeal Solusinya!</h3>
            <p className="text-xs sm:text-sm text-white/90">
              Pesan makanan favoritmu sekarang dan rasakan kelezatannya hari ini.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#F05A28] hover:bg-[#FFF3D6] font-heading font-bold text-xs sm:text-sm rounded-2xl shadow-md hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            <span>Jelajahi Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Dialog Informasi NIM & Judul Tugas Akhir */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-[#FFF3D6] bg-white">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] text-[#F05A28] flex items-center justify-center mb-2">
              <GraduationCap className="w-6 h-6" />
            </div>
            <DialogTitle className="font-heading font-extrabold text-xl text-[#3B2F2F]">
              Informasi Tugas Akhir
            </DialogTitle>
            <DialogDescription className="text-xs text-[#3B2F2F]/70">
              Detail identitas mahasiswa dan judul proyek aplikasi GOMeal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs sm:text-sm">
            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/50 border border-[#FFF3D6]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F05A28] block">
                NIM Mahasiswa
              </span>
              <span className="font-mono font-bold text-[#3B2F2F] text-sm">
                [21120124120041]
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF3D6]/50 border border-[#FFF3D6]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F05A28] block">
                Judul Tugas Akhir
              </span>
              <span className="font-bold text-[#3B2F2F]">
                Aplikasi Pemesanan Makanan Online GOMeal ("Good Food, Good Mood!") Berbasis Mobile-First Web & REST API
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsInfoOpen(false)}
              className="px-5 py-2.5 bg-[#F05A28] hover:bg-[#F05A28]/90 text-white font-bold text-xs rounded-xl transition-all"
            >
              Tutup
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
