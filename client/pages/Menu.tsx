import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Utensils, SlidersHorizontal, ChevronLeft, ChevronRight, Inbox, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FoodCard from "@/components/FoodCard";
import { api } from "@/lib/api";
import type { MenuItem, Category } from "@shared/schema";
import type { PaginatedResponse } from "@shared/api";

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "Semua";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "rating";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const {
    data: menuData,
    isLoading,
    error,
  } = useQuery<PaginatedResponse<MenuItem>>({
    queryKey: ["menu-list", currentCategory, currentSearch, currentSort, currentPage],
    queryFn: () =>
      api.getMenuItems({
        category: currentCategory,
        search: currentSearch,
        sort: currentSort,
        page: currentPage,
        limit: 9,
      }),
  });

  const handleCategorySelect = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === "Semua") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sortValue);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FFF3D6]/30">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#3B2F2F]">
              Katalog Menu Makanan
            </h1>
            <p className="text-xs sm:text-sm text-[#3B2F2F]/70 mt-1">
              Jelajahi berbagai hidangan lezat siap santap dari GOMeal.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-[#3B2F2F]/60" />
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-[#F6C445]/40 rounded-xl px-3 py-2 text-xs font-semibold text-[#3B2F2F] focus:outline-none focus:ring-2 focus:ring-[#F05A28]"
            >
              <option value="rating">Terpopuler (Rating)</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
              <option value="name">Nama (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSubmit={handleSearchSubmit}
            placeholder="Cari makanan berdasarkan nama atau bahan..."
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect("Semua")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              currentCategory === "Semua"
                ? "bg-[#F05A28] text-white shadow-sm"
                : "bg-white text-[#3B2F2F] hover:bg-[#FFF3D6] border border-[#FFF3D6]"
            }`}
          >
            Semua
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                currentCategory === cat.name
                  ? "bg-[#F05A28] text-white shadow-sm"
                  : "bg-white text-[#3B2F2F] hover:bg-[#FFF3D6] border border-[#FFF3D6]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-white skeleton" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-700 max-w-md mx-auto my-8">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-bold text-sm">Gagal Memuat Menu</h3>
            <p className="text-xs mt-1">{(error as Error).message || "Terjadi kesalahan koneksi database."}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && menuData?.data?.length === 0 && (
          <div className="bg-white rounded-3xl border border-[#FFF3D6] p-12 text-center max-w-md mx-auto my-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#FFF3D6] flex items-center justify-center mx-auto text-[#F05A28]">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#3B2F2F]">Makanan Tidak Ditemukan</h3>
            <p className="text-xs text-[#3B2F2F]/70">
              Tidak ada menu yang cocok dengan kata kunci atau kategori yang Anda pilih.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchParams({});
                setSearchTerm("");
              }}
              className="mt-2 px-5 py-2.5 bg-[#F6C445] text-[#3B2F2F] font-bold text-xs rounded-xl hover:bg-[#F6C445]/90 transition-all"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Food Grid */}
        {!isLoading && !error && (menuData?.data?.length || 0) > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
              {menuData?.data.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination Controls */}
            {menuData && menuData.pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-2.5 rounded-xl border border-[#F6C445]/50 bg-white text-[#3B2F2F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF3D6] transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-[#3B2F2F]">
                  Halaman {currentPage} dari {menuData.pagination.totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= menuData.pagination.totalPages}
                  className="p-2.5 rounded-xl border border-[#F6C445]/50 bg-white text-[#3B2F2F] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF3D6] transition-colors"
                  aria-label="Halaman selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
