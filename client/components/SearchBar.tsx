import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Cari makanan favoritmu...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#3B2F2F]/40">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSubmit) onSubmit();
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-[#F6C445]/40 text-[#3B2F2F] placeholder-[#3B2F2F]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#F05A28] focus:border-transparent shadow-sm transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#3B2F2F]/40 hover:text-[#3B2F2F]"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
