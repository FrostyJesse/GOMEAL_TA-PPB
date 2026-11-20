import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Code2, CheckCircle2, User, Layers, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";

export default function About() {
  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
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
        <div className="bg-gradient-to-br from-[#F6C445] via-[#F6C445]/90 to-[#F05A28] rounded-3xl p-8 text-center text-[#3B2F2F] shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-white/95 shadow-md flex items-center justify-center mx-auto text-[#F05A28] font-heading font-extrabold text-2xl">
            GO
          </div>
          <h1 className="font-heading font-extrabold text-3xl">GOMeal</h1>
          <p className="font-heading font-extrabold text-base text-white tracking-wide">
            "Good Food, Good Mood!"
          </p>
          <p className="text-xs sm:text-sm text-[#3B2F2F]/85 max-w-lg mx-auto leading-relaxed pt-2">
            GOMeal adalah aplikasi pemesanan makanan modern yang dirancang untuk memberikan pengalaman memesan hidangan favorit secara praktis, nyaman, dan menyenangkan.
          </p>
        </div>

        {/* Tujuan Pengembangan */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#F05A28]">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-heading font-bold text-lg text-[#3B2F2F]">Tujuan Pengembangan</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3B2F2F]/80 leading-relaxed">
            Aplikasi GOMeal dikembangkan sebagai solusi digital pemesanan makanan berbasis mobile-first yang menghubungkan penikmat kuliner dengan menu-menu berkualitas. Fokus utama kami adalah menghadirkan antarmuka pengguna yang bersih, responsif, dan alur transaksi yang transparan serta aman.
          </p>
        </div>

        {/* Fitur Utama */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#8BC34A]">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="font-heading font-bold text-lg text-[#3B2F2F]">Fitur Utama Aplikasi</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3B2F2F]/80">
            <div className="p-3 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Eksplorasi Katalog Menu:</strong> Pencarian, filter kategori, dan sorting harga/popularitas.</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Detail Menu Lengkap:</strong> Informasi stok, estimasi masak, rating, dan foto resolusi tinggi.</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Keranjang & Checkout:</strong> Pengaturan kuantitas instan, diskon otomatis, dan simulasi pembayaran (COD, Bank, QRIS).</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Lacak Status Pesanan:</strong> Timeline status pesanan interaktif dan fitur batalkan pesanan.</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Sistem Favorit:</strong> Simpan menu yang Anda sukai ke dalam daftar pribadi.</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF3D6]/40 border border-[#FFF3D6] flex items-start gap-2">
              <span className="text-[#F05A28] font-bold">✓</span>
              <span><strong>Bottom Navigation Bar:</strong> Akses navigasi cepat 5 menu yang optimal di layar ponsel.</span>
            </div>
          </div>
        </div>

        {/* Teknologi yang Digunakan */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3B2F2F]">
            <Code2 className="w-5 h-5 text-[#F6C445]" />
            <h2 className="font-heading font-bold text-lg text-[#3B2F2F]">Teknologi yang Digunakan</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-[#3B2F2F] block">Frontend</span>
              <span className="text-[#3B2F2F]/70">React 18, TypeScript, Tailwind CSS, Vite</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-[#3B2F2F] block">Backend</span>
              <span className="text-[#3B2F2F]/70">Express.js, Node.js, JWT, bcryptjs</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-[#3B2F2F] block">Database</span>
              <span className="text-[#3B2F2F]/70">PostgreSQL (Supabase Cloud)</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-[#3B2F2F] block">State & Data</span>
              <span className="text-[#3B2F2F]/70">React Query, Context API</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-[#3B2F2F] block">Ikon & Aset</span>
              <span className="text-[#3B2F2F]/70">Lucide React Icons</span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-[#3B2F2F] block">PWA Support</span>
              <span className="text-[#3B2F2F]/70">Vite PWA Plugin</span>
            </div>
          </div>
        </div>

        {/* Informasi Versi & Pengembang */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-[#3B2F2F]">
            <User className="w-5 h-5 text-[#F05A28]" />
            <h2 className="font-heading font-bold text-lg text-[#3B2F2F]">Informasi Pengembang & Aplikasi</h2>
          </div>

          <div className="space-y-2 text-xs text-[#3B2F2F]/80">
            <div className="flex justify-between py-1.5 border-b border-[#FFF3D6]">
              <span>Versi Aplikasi:</span>
              <span className="font-mono font-bold text-[#3B2F2F]">v2.0.0 (GOMeal Rebranded)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#FFF3D6]">
              <span>Nama Proyek:</span>
              <span className="font-bold text-[#3B2F2F]">GOMeal — Pemesanan Makanan</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#FFF3D6]">
              <span>Pengembang:</span>
              <span className="font-bold text-[#3B2F2F]">Timotius & Tim Pengembang</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span>Mata Kuliah / Tugas:</span>
              <span className="font-bold text-[#3B2F2F]">Praktikum PPB (Pemrograman Perangkat Bergerak)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
