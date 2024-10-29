"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useSearchParams, useRouter } from "next/navigation";
// Type
import { ClassNameProps } from "@/types/props";
// Utility
import UtilityHook from "@/components/UtilityHook";
// Icon
import { GoSearch } from "react-icons/go";

const SearchBar: NextPage<ClassNameProps> = ({ className = "" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { createQueryString } = UtilityHook();
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    if (searchTerm)
      router.push(
        "/recipe?" + createQueryString("search", searchTerm.trim(), true)
      );
    else router.push("/recipe");
  };

  const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <search
      className={`flex items-center rounded-sm h-12 w-full max-w-[600px] ${className}`}
    >
      <input
        type="text"
        placeholder="Search for recipes"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => handlePressEnter(e)}
        className="text-sm h-full px-3 rounded-sm focus:outline-none flex-1 bg-neutral-50 border-l border-t border-b"
      />
      <button
        type="button"
        className="bg-primary hover:bg-secondary h-full aspect-square rounded-r-sm transition-colors duration-200"
        onClick={handleSearch}
      >
        <GoSearch className="text-white mx-auto" size={20} />
      </button>
    </search>
  );
};

export default SearchBar;
