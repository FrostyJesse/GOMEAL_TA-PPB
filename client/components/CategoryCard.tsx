import { Link } from "react-router-dom";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category & { menu_count?: number };
  isSelected?: boolean;
  onClick?: () => void;
}

export default function CategoryCard({ category, isSelected, onClick }: CategoryCardProps) {
  const content = (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all cursor-pointer min-w-[80px] sm:min-w-[96px] ${
        isSelected
          ? "bg-[#F6C445] text-[#3B2F2F] shadow-md scale-105 font-bold"
          : "bg-white text-[#3B2F2F] hover:bg-[#FFF3D6] border border-[#FFF3D6] shadow-sm font-medium"
      }`}
    >
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FFF3D6] flex items-center justify-center p-1">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        ) : (
          <span className="text-xl">🍲</span>
        )}
      </div>
      <span className="text-xs text-center leading-tight whitespace-nowrap">
        {category.name}
      </span>
    </div>
  );

  if (onClick) {
    return <button type="button" onClick={onClick}>{content}</button>;
  }

  return <Link to={`/menu?category=${encodeURIComponent(category.name)}`}>{content}</Link>;
}
