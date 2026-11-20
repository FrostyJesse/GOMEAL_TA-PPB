import { Link, useLocation } from "react-router-dom";
import { Home, Utensils, ClipboardList, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  const navItems = [
    { icon: Home, label: "Beranda", path: "/" },
    { icon: Utensils, label: "Menu", path: "/menu" },
    { icon: ClipboardList, label: "Pesanan", path: "/orders" },
    { icon: ShoppingCart, label: "Keranjang", path: "/cart", badge: totalItems },
    { icon: User, label: "Profil", path: "/profile" },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFF3D6]/95 backdrop-blur-md border-t border-[#F6C445]/40 shadow-lg px-2 py-1 md:py-2"
      aria-label="Navigasi Utama"
    >
      <div className="max-w-md md:max-w-2xl mx-auto flex justify-around items-center">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "text-[#F05A28] font-bold scale-105"
                  : "text-[#3B2F2F]/60 hover:text-[#3B2F2F] hover:bg-[#F6C445]/20 font-medium"
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-transform",
                    isActive ? "stroke-[2.5px] scale-110" : "stroke-2"
                  )}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#F05A28] text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm animate-fade-in">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 leading-tight tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#F05A28] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
