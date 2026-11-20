import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Header from "@/components/Header";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md bg-white rounded-3xl border border-[#FFF3D6] p-8 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#FFF3D6] text-[#F05A28] flex items-center justify-center mx-auto text-4xl font-extrabold font-heading">
            404
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#3B2F2F]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-[#3B2F2F]/70 leading-relaxed">
            Maaf, halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#F05A28] text-white font-heading font-bold text-xs rounded-2xl hover:bg-[#F05A28]/90 transition-all shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
