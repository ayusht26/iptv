"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Category, Country } from "@/lib/iptv/types";
import { SlidersHorizontal, Globe, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface FilterBarProps {
  categories: Category[];
  countries: Country[];
  selectedCategory: string;
  selectedCountry: string;
}

export function FilterBar({
  categories,
  countries,
  selectedCategory,
  selectedCountry,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const activeCategory = searchParams.get("category") || selectedCategory;
  const activeCountry = searchParams.get("country") || selectedCountry;

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollButtons();

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distance = 300;
    el.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleReset = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(activeCategory || activeCountry);

  return (
    <div id="categories" className="w-full flex flex-col gap-4 py-4">
      {/* Top row: Dropdowns & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-ink-muted shrink-0" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink">
            Filter Channels
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Country Selector */}
          <div className="relative flex items-center">
            <Globe className="w-3.5 h-3.5 text-ink-muted absolute left-3 pointer-events-none" />
            <select
              value={activeCountry}
              onChange={(e) => updateParam("country", e.target.value)}
              className="bg-surface-1 text-ink border border-hairline hover:border-hairline/80 focus:border-accent-blue rounded-md pl-8 pr-8 py-2 text-xs appearance-none cursor-pointer focus:outline-none transition-colors"
            >
              <option value="">All Countries ({countries.length})</option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 bg-surface-1 hover:bg-surface-2 text-ink-muted hover:text-ink border border-hairline px-3 py-2 rounded-md text-xs transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Category Pills with Left & Right Nav Buttons */}
      <div className="relative w-full flex items-center group/scroll">
        {/* Left Nav Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll categories left"
            className="absolute left-0 z-10 p-2 rounded-full bg-surface-1 hover:bg-surface-2 text-ink border border-hairline shadow-lg backdrop-blur-md transition-all active:scale-95 -ml-3"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Pills Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth w-full px-1"
        >
          <button
            onClick={() => updateParam("category", "")}
            className={`shrink-0 text-xs font-medium px-4 py-2 rounded-pill transition-all ${
              !activeCategory
                ? "bg-surface-2 text-ink border border-hairline shadow-sm font-semibold"
                : "bg-canvas text-ink-muted hover:text-ink border border-transparent hover:bg-surface-1"
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected =
              activeCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => updateParam("category", isSelected ? "" : cat.id)}
                className={`shrink-0 text-xs font-medium px-4 py-2 rounded-pill transition-all capitalize ${
                  isSelected
                    ? "bg-surface-2 text-ink border border-hairline shadow-sm font-semibold"
                    : "bg-canvas text-ink-muted hover:text-ink border border-transparent hover:bg-surface-1"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Right Nav Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll categories right"
            className="absolute right-0 z-10 p-2 rounded-full bg-surface-1 hover:bg-surface-2 text-ink border border-hairline shadow-lg backdrop-blur-md transition-all active:scale-95 -mr-3"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

