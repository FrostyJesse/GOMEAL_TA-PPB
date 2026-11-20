import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#3B2F2F] text-white py-10 px-4 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F6C445] flex items-center justify-center">
              <span className="font-heading font-extrabold text-sm text-[#3B2F2F]">GO</span>
            </div>
            <span className="font-heading font-extrabold text-xl text-white">
              GO<span className="text-[#F05A28]">Meal</span>
            </span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed max-w-sm">
            "Good Food, Good Mood!" GOMeal adalah aplikasi pemesanan makanan pilihan yang menyajikan hidangan lezat, higienis, dan cepat sampai ke tempat Anda.
          </p>
        </div>

        {/* Navigasi */}
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-sm text-[#F6C445]">Navigasi Cepat</h4>
          <ul className="space-y-1.5 text-xs text-white/80">
            <li>
              <Link to="/" className="hover:text-[#F6C445] transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-[#F6C445] transition-colors">
                Katalog Menu
              </Link>
            </li>
            <li>
              <Link to="/orders" className="hover:text-[#F6C445] transition-colors">
                Riwayat Pesanan
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#F6C445] transition-colors">
                Tentang GOMeal
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div className="space-y-2">
          <h4 className="font-heading font-bold text-sm text-[#F6C445]">Layanan Pelanggan</h4>
          <p className="text-xs text-white/80">
            WhatsApp / Telepon: +62 812-3456-7890
          </p>
          <p className="text-xs text-white/80">
            Email: bantuan@gomeal.id
          </p>
          <p className="text-xs text-white/60 pt-2 flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 fill-[#F05A28] text-[#F05A28]" /> untuk pecinta kuliner
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-white/10 text-center text-xs text-white/50">
        © {new Date().getFullYear()} GOMeal Indonesia. Hak Cipta Dilindungi.
      </div>
    </footer>
  );
}
