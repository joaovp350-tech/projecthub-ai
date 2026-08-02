"use client";

import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function SearchInput({
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />

      <input
        type="search"
        className={`w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
}