"use client";

import { NextPage } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// Type
import { PaginationProps } from "@/types/props";
// Utility
import UtilityHook from "@/components/UtilityHook";
// Constant
import { ITEM_PER_EXPLORE_PAGE } from "@/constants";
// Icon
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const WINDOW_SIZE = 5;
const ARROW_SIZE = 20;

const Pagination: NextPage<PaginationProps> = ({ totalItems }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / ITEM_PER_EXPLORE_PAGE);
  const { createQueryString } = UtilityHook(); // this function required client component

  // Calculate start and end of the sliding window
  let windowStart = Math.max(1, currentPage - Math.floor(WINDOW_SIZE / 2));
  const windowEnd = Math.min(totalPages, windowStart + WINDOW_SIZE - 1);

  if (windowEnd - windowStart + 1 < WINDOW_SIZE) {
    windowStart = Math.max(1, windowEnd - WINDOW_SIZE + 1);
  }

  const middlePosition = Math.ceil(WINDOW_SIZE / 2);

  return (
    <div className="text-end pb-6">
      {/* Items Info */}
      <span className="hidden text-sm text-gray-700">
        {ITEM_PER_EXPLORE_PAGE * (currentPage - 1) + 1}-
        {Math.min(ITEM_PER_EXPLORE_PAGE * currentPage, totalItems)} of{" "}
        {totalItems}
      </span>
      <div className="flex justify-center gap-1 text-lg">
        {/* Left Arrow */}
        {currentPage > 1 && (
          <Link
            href={
              "/recipe?" + createQueryString("page", String(currentPage - 1))
            }
            className="hover:text-slate-400"
          >
            <SlArrowLeft size={ARROW_SIZE} className="inline-block" />
          </Link>
        )}
        {/* Page numbers */}
        {totalPages > WINDOW_SIZE && currentPage > middlePosition && (
          <Link
            href={"/recipe?" + createQueryString("page", "1")}
            className="btn-explore-pagination hover:bg-gray-200"
          >
            1
          </Link>
        )}

        {totalPages > WINDOW_SIZE + 1 && currentPage >= WINDOW_SIZE && (
          <span className="select-none">...</span>
        )}

        {Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => {
          return (
            <Link
              key={i}
              href={
                "/recipe?" + createQueryString("page", String(windowStart + i))
              }
              className={`btn-explore-pagination ${
                currentPage === windowStart + i
                  ? "bg-primary text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {windowStart + i}
            </Link>
          );
        })}

        {totalPages > WINDOW_SIZE + 1 &&
          currentPage < totalPages - middlePosition && (
            <span className="select-none">...</span>
          )}

        {totalPages > WINDOW_SIZE &&
          currentPage <= totalPages - middlePosition && (
            <Link
              href={"/recipe?" + createQueryString("page", String(totalPages))}
              className="btn-explore-pagination hover:bg-gray-200"
            >
              {totalPages}
            </Link>
          )}
        {/* Right Arrow */}
        {currentPage < totalPages && (
          <Link
            href={
              "/recipe?" + createQueryString("page", String(currentPage + 1))
            }
            className="hover:text-slate-400"
          >
            <SlArrowRight size={ARROW_SIZE} className="inline" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Pagination;
