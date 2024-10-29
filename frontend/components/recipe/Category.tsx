"use client";

import { useState, useRef, useLayoutEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NextPage } from "next";
// Type
import { CategoryProps } from "@/types/props";
// Utility
import UtilityHook from "@/components/UtilityHook";
// Constant
import {
  CATEGORIES_FILTER,
  DROPDOWN_ITEM_HEIGHT,
  ITEM_PER_EXPLORE_PAGE,
} from "@/constants";
// Icon
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdFastfood } from "react-icons/md";

// ceiling to nearest 5
const DROPDOWN_MAX_HEIGHT =
  Math.ceil((DROPDOWN_ITEM_HEIGHT * CATEGORIES_FILTER.length) / 5) * 5;

const Category: NextPage<CategoryProps> = ({ totalItems, className = "" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const { createMultiQueryString } = UtilityHook();
  // Query string
  const categories = searchParams.getAll("categories");
  const currentPage = Number(searchParams.get("page")) || 1;
  // State
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // Ref
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement; // prevent TypeScript warning

      if (
        dropdownRef.current &&
        dropdownListRef.current &&
        !dropdownRef.current.contains(target) &&
        !dropdownListRef.current.contains(target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelect = (value: string) => {
    let newQueryString = "";
    if (categories.includes(value)) {
      params.delete("categories", value);
      params.set("page", "1"); // reset page
      newQueryString = params.toString();
    } else newQueryString = createMultiQueryString("categories", value);

    router.push("/recipe?" + newQueryString, {
      scroll: false,
    });
  };

  return (
    <div className={`dropdown-container ${className}`}>
      <div
        className={`dropdown-box group  ${
          categories.length > 0 ? "border-primary" : ""
        }`}
        // we make ref and onclick here to prevent list close when check on the box
        ref={dropdownRef}
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {/* Size should be include x-padding */}
        <MdFastfood
          size={46}
          className="border-r h-full px-2 group-hover:border-neutral-400"
        />
        <p className="mx-auto">
          <span className="pl-2 text-sm">Category&nbsp;</span>
          <MdKeyboardArrowDown
            className="inline-block transition-transform duration-200"
            style={{ transform: `rotate(${showDropdown ? "180" : "0"}deg)` }}
          />
        </p>
      </div>
      {/* Dropdown list */}
      <div
        ref={dropdownListRef}
        // bottom should be equal to border-top-width to make the box perfectly align
        className="dropdown-list flex flex-col"
        style={{
          opacity: showDropdown ? 1 : 0,
          // use the number that can cover the element
          maxHeight: showDropdown ? `${DROPDOWN_MAX_HEIGHT}px` : 0,
        }}
      >
        {CATEGORIES_FILTER.map((item, idx) => (
          <label
            key={idx}
            className="py-2 pl-2 text-sm hover:bg-neutral-100 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={categories.includes(item.value)}
              value={item.value}
              name={item.label}
              onChange={(e) => handleSelect(e.target.value)}
              className="appearance-none accent-black checkmark cursor-pointer"
            />
            {item.label}
          </label>
        ))}
      </div>
      {/* Search Info */}
      {/* we place it here cause it need to be positioned at right-bottom of category component */}
      {totalItems > 0 && (
        <span className="absolute -bottom-6 right-0 text-sm text-gray-700 text-end cursor-default">
          {ITEM_PER_EXPLORE_PAGE * (currentPage - 1) + 1}-
          {Math.min(ITEM_PER_EXPLORE_PAGE * currentPage, totalItems)} of{" "}
          {totalItems}
        </span>
      )}
    </div>
  );
};

export default Category;
