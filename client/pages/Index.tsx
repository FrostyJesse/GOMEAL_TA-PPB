import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Utensils, ArrowRight, Sparkles, TrendingUp, Compass, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FoodCard from "@/components/FoodCard";
import CategoryCard from "@/components/CategoryCard";
import { api } from "@/lib/api";
import type { MenuItem, Category } from "@shared/schema";

export default function Index() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: categoriesData, isLoading: isLoadingCats } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const { data: popularMenuData, isLoading: isLoadingPopular } = useQuery<{ data: MenuItem[] }>({
    queryKey: ["menu-popular"],
    queryFn: () => api.getMenuItems({ limit: 6, sort: "rating" }),
  });

  const { data: recommendedMenuData, isLoading: isLoadingRec } = useQuery<{ data: MenuItem[] }>({
    queryKey: ["menu-recommended"],
    queryFn: () => api.getMenuItems({ limit: 6, sort: "price_asc" }),
  });

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigate(`/menu?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
        {/* Search Bar Section */}
        <section className="max-w-xl mx-auto">
          <SearchBar
            value={search}
            onChange={setSearch}
            onSubmit={handleSearchSubmit}
            placeholder="Cari nasi goreng, ayam geprek, es teh..."
          />
        </section>

        {/* Hero Banner Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F6C445] via-[#F6C445]/90 to-[#F05A28] p-6 sm:p-10 shadow-md">
          <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-[#F05A28] text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Good Food, Good Mood!
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#3B2F2F] leading-tight">
              Perut Lapar? <br />
              <span className="text-[#F05A28]">GOMeal</span> Solusinya!
            </h1>
            <p className="text-sm sm:text-base text-[#3B2F2F]/85 font-medium leading-relaxed">
              Temukan makanan favoritmu dari berbagai pilihan menu lezat dan pesan dengan mudah dalam beberapa ketukan.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F05A28] hover:bg-[#F05A28]/90 text-white font-heading font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>Jelajahi Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative food illustration overlay */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:flex items-center justify-end pointer-events-none pr-6">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop"
              alt="GOMeal Makanan"
              className="w-72 h-72 object-cover rounded-full shadow-2xl border-4 border-white/80 rotate-6"
            />
          </div>
        </section>

        {/* Kategori Makanan Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#F05A28]" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#3B2F2F]">
                Kategori Makanan
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-[#F05A28] hover:underline flex items-center gap-1"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingCats ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="min-w-[80px] h-20 rounded-2xl bg-white/70 skeleton" />
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              <Link
                to="/menu"
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white text-[#3B2F2F] hover:bg-[#FFF3D6] border border-[#FFF3D6] shadow-sm font-medium min-w-[80px] sm:min-w-[96px] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F6C445]/30 flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-[#F05A28]" />
                </div>
                <span className="text-xs text-center leading-tight whitespace-nowrap">Semua</span>
              </Link>
              {categoriesData?.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </section>

        {/* Menu Populer Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F05A28]" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#3B2F2F]">
                Menu Populer
              </h2>
            </div>
            <Link
              to="/menu?sort=rating"
              className="text-xs font-bold text-[#F05A28] hover:underline flex items-center gap-1"
            >
              Lihat Semua
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingPopular ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {popularMenuData?.data?.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        {/* Rekomendasi Untukmu Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8BC34A]" />
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#3B2F2F]">
                Rekomendasi Untukmu
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-xs font-bold text-[#F05A28] hover:underline flex items-center gap-1"
            >
              Semua Menu
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoadingRec ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-white skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {recommendedMenuData?.data?.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
