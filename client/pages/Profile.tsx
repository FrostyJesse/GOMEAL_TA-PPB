import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  Phone,
  MapPin,
  Mail,
  ClipboardList,
  Heart,
  Info,
  LogOut,
  Edit3,
  Check,
  Shield,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, refreshUser, isAdmin } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setAvatarUrl(user.avatar_url || "");
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF3D6]/30">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF3D6] flex items-center justify-center mx-auto text-[#F05A28]">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="font-heading font-bold text-xl text-[#3B2F2F]">Profil Pengguna</h2>
          <p className="text-xs text-[#3B2F2F]/70">
            Silakan masuk ke akun Anda untuk melihat dan mengelola profil Anda.
          </p>
          <Link
            to="/auth?redirect=/profile"
            className="inline-block px-6 py-2.5 bg-[#F05A28] text-white font-bold text-xs rounded-xl shadow-md"
          >
            Masuk / Daftar
          </Link>
        </main>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        avatar_url: avatarUrl.trim() || undefined,
      });
      await refreshUser();
      setIsEditing(false);
      toast({
        title: "Profil Diperbarui",
        description: "Data profil Anda berhasil disimpan.",
      });
    } catch (err: any) {
      toast({
        title: "Gagal Menyimpan",
        description: err.message || "Terjadi kesalahan saat menyimpan profil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Berhasil Keluar",
      description: "Anda telah keluar dari akun GOMeal.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30 pb-20">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-[#F6C445] border-2 border-white shadow-md flex items-center justify-center text-2xl font-extrabold text-[#3B2F2F] overflow-hidden flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.username} className="w-full h-full object-cover" />
            ) : (
              (fullName || user?.username || "U")[0].toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="font-heading font-extrabold text-xl text-[#3B2F2F] truncate">
                {fullName || user?.username}
              </h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#F05A28] text-white px-2 py-0.5 rounded-full">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#3B2F2F]/60 mt-0.5">@{user?.username}</p>
            <p className="text-xs text-[#3B2F2F]/80 flex items-center justify-center sm:justify-start gap-1.5 mt-2">
              <Mail className="w-3.5 h-3.5 text-[#F05A28]" />
              <span>{user?.email}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-[#F6C445] text-xs font-bold text-[#3B2F2F] hover:bg-[#FFF3D6] transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Batal" : "Edit Profil"}</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl border border-[#FFF3D6] p-6 shadow-sm space-y-4 animate-fade-in"
          >
            <h3 className="font-heading font-bold text-base text-[#3B2F2F]">Edit Data Profil</h3>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2F] mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2F] mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 08123456789"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2F] mb-1">Alamat Utama</label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat rumah atau kantor..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2F] mb-1">URL Foto Profil (Opsional)</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F6C445]/40 text-xs text-[#3B2F2F] focus:ring-2 focus:ring-[#F05A28] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-xl bg-[#F05A28] text-white font-bold text-xs hover:bg-[#F05A28]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick Menu Links */}
        <div className="bg-white rounded-3xl border border-[#FFF3D6] overflow-hidden shadow-sm divide-y divide-[#FFF3D6]">
          <Link
            to="/orders"
            className="flex items-center justify-between p-4 hover:bg-[#FFF3D6]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F6C445]/30 text-[#3B2F2F] flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#F05A28]" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#3B2F2F] block">Riwayat Pesanan</span>
                <span className="text-xs text-[#3B2F2F]/60">Lihat semua status pesanan makanan Anda</span>
              </div>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center justify-between p-4 hover:bg-[#FFF3D6]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#3B2F2F] block">Menu Favorit</span>
                <span className="text-xs text-[#3B2F2F]/60">Daftar makanan yang Anda sukai</span>
              </div>
            </div>
          </Link>

          <Link
            to="/about"
            className="flex items-center justify-between p-4 hover:bg-[#FFF3D6]/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#3B2F2F] block">Tentang GOMeal</span>
                <span className="text-xs text-[#3B2F2F]/60">Informasi aplikasi, fitur, dan pengembang</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-3 px-4 rounded-2xl bg-white border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun</span>
        </button>
      </main>
    </div>
  );
}
