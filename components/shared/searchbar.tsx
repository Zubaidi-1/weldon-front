"use client";

import { useEffect, useRef } from "react";
import SearchIcon from "../svg/Search";

export default function Searchbar({ active }: { active?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (active) {
      inputRef.current?.focus();
    }
  }, [active]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-blue-200 bg-white shadow-sm">
        <SearchIcon size={18} className="text-blue-500" />

        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
}
