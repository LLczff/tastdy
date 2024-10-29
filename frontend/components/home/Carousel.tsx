"use client";

import { useState, useEffect } from "react";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
// Type
import { CarouselProps } from "@/types/props";
// Utility
import UtilityHook from "@/components/UtilityHook";
// Icon
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoHeart } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";

const Carousel: NextPage<CarouselProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cardsPerPage, setCardsPerPage] = useState<number>(1);
  const { openPostModal } = UtilityHook();

  // we increment 1 card per arrow click, not the entire pages
  const totalPages = data.length - cardsPerPage + 1;

  useEffect(() => {
    // Update the number of cards per page based on screen width
    const handleResize = () => {
      if (window.innerWidth < 576) {
        setCardsPerPage(1);
      } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
        setCardsPerPage(2);
      } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
        setCardsPerPage(3);
      } else if (window.innerWidth >= 992 && window.innerWidth < 1280) {
        setCardsPerPage(4);
      } else {
        setCardsPerPage(5);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Always reset current page when cards per page changes to prevent unproper display
    setCurrentPage(1);
  }, [cardsPerPage]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((curr) => curr - 1);
    } else {
      setCurrentPage(totalPages);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((curr) => curr + 1);
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <section className="w-full bg-stone-100 py-6">
      <h2 className="font-semibold text-2xl text-center mb-5">
        OUR RECOMMENDED
      </h2>
      <div className="w-full">
        {/* Navigate to explore page */}
        <div className="text-end font-semibold pr-2">
          <Link href="/recipe" className="group">
            <span className="group-hover:underline">See more</span>
            <FiArrowRight className="inline-block transition-transform group-hover:translate-x-[3px]" />
          </Link>
        </div>
        {/* Card */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300"
              style={{
                transform: `translateX(-${
                  (currentPage - 1) * (100 / cardsPerPage)
                }%)`,
              }}
            >
              {data.map((item, index) => (
                <div key={index} className="carousel-page">
                  <article
                    className="flex flex-col items-center bg-white w-fit p-3 cursor-pointer hover:scale-[1.02] shadow-lg max-w-min"
                    onClick={() => openPostModal(item._id)}
                  >
                    <div className="carousel-img-container">
                      <Image
                        src={item.image}
                        fill
                        alt={item.dish}
                        className="object-cover object-bottom rounded-sm"
                        sizes="100vw, (min-width: 576px) 50vw, (min-width: 768px) 33.33vw, (min-width: 1024px) 25vw, (min-width: 1280px) 20vw"
                      />
                    </div>
                    <figcaption className="mt-4 text-center">
                      <h3 className="font-bodoni-moda font-semibold">
                        {item.dish}
                      </h3>
                      <p className="font-light text-xs mt-2 text-neutral-400">
                        <span>{item.author} | </span>
                        <IoHeart className="inline-block text-red-400" />
                        <span className="align-middle">
                          &nbsp;{item.favorite}
                        </span>
                      </p>
                    </figcaption>
                  </article>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <IoIosArrowBack
            size={32}
            onClick={prevPage}
            className="carousel-arrow left-0"
          />
          <IoIosArrowForward
            size={32}
            onClick={nextPage}
            className="carousel-arrow right-0"
          />

          {/* Pagination */}
          <div className="text-center mt-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                type="button"
                className={`inline-block w-6 h-[6px] mx-1 rounded-full  ${
                  idx === currentPage - 1
                    ? "bg-primary"
                    : "bg-secondary opacity-40"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
