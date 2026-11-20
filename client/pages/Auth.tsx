import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/profile";

  const { login, register } = useAuth();
  const { toast } = useToast();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast({
        title: "Input Belum Lengkap",
        description: "Silakan masukkan email/username dan password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await login(identifier.trim(), password);
      toast({
        title: "Berhasil Masuk!",
        description: "Selamat datang kembali di GOMeal.",
      });
      navigate(redirect);
    } catch (err: any) {
      toast({
        title: "Gagal Masuk",
        description: err.message || "Email/Username atau password salah.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !username.trim() || !password) {
      toast({
        title: "Input Belum Lengkap",
        description: "Semua kolom wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Terlalu Pendek",
        description: "Password minimal 6 karakter.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await register(email.trim(), username.trim(), password);
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda berhasil dibuat. Silakan masuk.",
      });
      setIsLoginTab(true);
      setIdentifier(email);
    } catch (err: any) {
      toast({
        title: "Gagal Mendaftar",
        description: err.message || "Terjadi kesalahan saat registrasi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
      <Header />

      <main className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 sm:p-8 shadow-sm space-y-6">
          {/* Logo & Greeting */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#F6C445] flex items-center justify-center mx-auto shadow-sm">
              <span className="font-heading font-extrabold text-xl text-[#3B2F2F]">GO</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#3B2F2F]">
              {isLoginTab ? "Masuk ke GOMeal" : "Daftar Akun Baru"}
            </h1>
            <p className="text-xs text-[#3B2F2F]/70">
              {isLoginTab
                ? "Nikmati kemudahan memesan makanan lezat kapan saja."
                : "Buat akun sekarang dan mulai petualangan kulinermu."}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#FFF3D6]/50 p-1 rounded-2xl border border-[#F6C445]/30">
            <button
              type="button"
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isLoginTab
                  ? "bg-[#F05A28] text-white shadow-sm"
                  : "text-[#3B2F2F]/70 hover:text-[#3B2F2F]"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                !isLoginTab
                  ? "bg-[#F05A28] text-white shadow-sm"
                  : "text-[#3B2F2F]/70 hover:text-[#3B2F2F]"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Login Form */}
          {isLoginTab ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Email atau Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3B2F2F]/40">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="nama@email.com atau username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3B2F2F]/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#F05A28] text-white font-heading font-bold text-xs sm:text-sm hover:bg-[#F05A28]/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sedang Masuk...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Alamat Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3B2F2F]/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3B2F2F]/40">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: budi123"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3B2F2F] mb-1">
                  Kata Sandi (Minimal 6 karakter) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3B2F2F]/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-[#F05A28] text-white font-heading font-bold text-xs sm:text-sm hover:bg-[#F05A28]/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
