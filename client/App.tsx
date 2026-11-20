import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

import BottomNav from "@/components/BottomNav";

// Pages
import Index from "./pages/Index";
import Menu from "./pages/Menu";
import MenuDetail from "./pages/MenuDetail";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* 1. Beranda */}
                <Route path="/" element={<Index />} />
                {/* 2. Menu Katalog & 3. Detail Menu */}
                <Route path="/menu" element={<Menu />} />
                <Route path="/menu/:id" element={<MenuDetail />} />
                {/* 4. Riwayat Pesanan & 5. Detail Pesanan */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetail />} />
                {/* 6. Keranjang & 7. Checkout */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                {/* 8. Profil & 9. Tentang GOMeal */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                {/* Autentikasi & Favorit */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/favorites" element={<Favorites />} />
                {/* 404 Catch-All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* Bottom Navigation Bar */}
              <BottomNav />
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
