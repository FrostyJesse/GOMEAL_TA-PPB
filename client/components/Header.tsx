import { Link, useLocation } from "react-router-dom";
import { Utensils, ShoppingCart, User, Heart, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-[#FFF3D6]/90 backdrop-blur-md border-b border-[#F6C445]/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#F6C445] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-heading font-extrabold text-lg text-[#3B2F2F] tracking-tighter">
              GO
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-heading font-extrabold text-xl text-[#3B2F2F]">GO</span>
              <span className="font-heading font-extrabold text-xl text-[#F05A28]">Meal</span>
            </div>
            <span className="text-[10px] font-medium text-[#3B2F2F]/70 -mt-1 hidden sm:block">
              Good Food, Good Mood!
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${location.pathname === "/"
                ? "text-[#F05A28]"
                : "text-[#3B2F2F] hover:text-[#F05A28]"
              }`}
          >
            Beranda
          </Link>
          <Link
            to="/menu"
            className={`text-sm font-semibold transition-colors ${location.pathname === "/menu"
                ? "text-[#F05A28]"
                : "text-[#3B2F2F] hover:text-[#F05A28]"
              }`}
          >
            Menu
          </Link>
          <Link
            to="/orders"
            className={`text-sm font-semibold transition-colors ${location.pathname.startsWith("/orders")
                ? "text-[#F05A28]"
                : "text-[#3B2F2F] hover:text-[#F05A28]"
              }`}
          >
            Pesanan
          </Link>
          <Link
            to="/favorites"
            className={`text-sm font-semibold transition-colors ${location.pathname === "/favorites"
                ? "text-[#F05A28]"
                : "text-[#3B2F2F] hover:text-[#F05A28]"
              }`}
          >
            Favorit
          </Link>
          <Link
            to="/about"
            className={`text-sm font-semibold transition-colors ${location.pathname === "/about"
                ? "text-[#F05A28]"
                : "text-[#3B2F2F] hover:text-[#F05A28]"
              }`}
          >
            Tentang GOMeal
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Favorites Link */}
          <Link
            to="/favorites"
            aria-label="Lihat Favorit"
            className="p-2 text-[#3B2F2F]/80 hover:text-[#F05A28] hover:bg-[#F6C445]/20 rounded-full transition-colors hidden sm:flex"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {/* Cart Icon with badge */}
          <Link
            to="/cart"
            aria-label="Keranjang Belanja"
            className="relative p-2 text-[#3B2F2F] hover:text-[#F05A28] hover:bg-[#F6C445]/20 rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F05A28] text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Profile or Login */}
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white/80 hover:bg-white border border-[#F6C445]/40 rounded-full transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#F6C445] flex items-center justify-center text-xs font-bold text-[#3B2F2F] overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  (user?.full_name || user?.username || "U")[0].toUpperCase()
                )}
              </div>
              <span className="text-xs font-semibold text-[#3B2F2F] max-w-[100px] truncate hidden sm:block">
                {user?.full_name || user?.username}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F05A28] text-white text-xs font-bold rounded-full hover:bg-[#F05A28]/90 transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
