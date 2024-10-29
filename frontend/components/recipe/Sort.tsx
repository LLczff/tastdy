"use client";

import { useState, useRef, useLayoutEffect, useMemo } from "react";
import { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// Type
import { ClassNameProps } from "@/types/props";
// Utility
import UtilityHook from "@/components/UtilityHook";
// Constant
import { DROPDOWN_ITEM_HEIGHT, SORT_LIST } from "@/constants";
// Icon
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSortAlt2 } from "react-icons/bi";

// ceiling to nearest 5
const DROPDOWN_MAX_HEIGHT =
  Math.ceil((DROPDOWN_ITEM_HEIGHT * SORT_LIST.length) / 5) * 5;

const Sort: NextPage<ClassNameProps> = ({ className = "" }) => {
  const searchParams = useSearchParams();
  const { createQueryString } = UtilityHook();
  // Query string
  const sortBy = searchParams.get("sort");

  // State
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  // Ref
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);

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

  const sortLabel = useMemo(
    () => SORT_LIST.find((item) => item.value === sortBy)?.label,
    [sortBy]
  );

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-container ${className}`}
      onClick={() => setShowDropdown((prev) => !prev)}
    >
      <div className="dropdown-box group">
        {/* Size should be include x-padding */}
        <BiSortAlt2
          size={46}
          className="border-r h-full px-2 group-hover:border-neutral-400"
        />
        {/* Use width to prevent changes when switch filter (number came from max width of filter label) */}
        <p className="mx-auto w-20">
          <span className="pl-2 text-sm">{sortLabel}&nbsp;</span>
          <MdKeyboardArrowDown
            className="inline-block transition-transform duration-200"
            style={{ transform: `rotate(${showDropdown ? "180" : "0"}deg)` }}
          />
        </p>
      </div>
      {/* Dropdown list */}
      <ul
        ref={dropdownListRef}
        // bottom should be equal to border-top-width to make the box perfectly align
        className="dropdown-list"
        style={{
          opacity: showDropdown ? 1 : 0,
          // use the number that can cover the element
          maxHeight: showDropdown ? `${DROPDOWN_MAX_HEIGHT}px` : 0,
        }}
      >
        {SORT_LIST.map((item, idx) => (
          <li key={idx} className="text-sm text-center hover:bg-neutral-100">
            <Link
              href={"/recipe?" + createQueryString("sort", item.value, true)}
              scroll={false}
              className="block py-2"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sort;
