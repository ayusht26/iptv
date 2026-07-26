"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Country, Language } from "@/lib/iptv/types";
import { SlidersHorizontal, Globe, Languages, RotateCcw } from "lucide-react";

interface FilterBarProps {
  categories: Category[];
  countries: Country[];
  languages: Language[];
  selectedCategory: string;
  selectedCountry: string;
  selectedLanguage: string;
}

export function FilterBar({
  categories,
  countries,
  languages,
  selectedCategory,
  selectedCountry,
  selectedLanguage,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    router.push("/", { scroll: false });
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedCountry || selectedLanguage
  );

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
              value={selectedCountry}
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

          {/* Language Selector */}
          <div className="relative flex items-center">
            <Languages className="w-3.5 h-3.5 text-ink-muted absolute left-3 pointer-events-none" />
            <select
              value={selectedLanguage}
              onChange={(e) => updateParam("lang", e.target.value)}
              className="bg-surface-1 text-ink border border-hairline hover:border-hairline/80 focus:border-accent-blue rounded-md pl-8 pr-8 py-2 text-xs appearance-none cursor-pointer focus:outline-none transition-colors"
            >
              <option value="">All Languages</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
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

      {/* Bottom row: Category Pills (Horizontally scrollable on mobile) */}
      <div className="relative w-full">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          <button
            onClick={() => updateParam("category", "")}
            className={`shrink-0 text-xs font-medium px-4 py-2 rounded-pill transition-colors ${
              !selectedCategory
                ? "bg-surface-2 text-ink border border-hairline shadow-sm"
                : "bg-canvas text-ink-muted hover:text-ink border border-transparent"
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.id)}
                className={`shrink-0 text-xs font-medium px-4 py-2 rounded-pill transition-colors capitalize ${
                  isSelected
                    ? "bg-surface-2 text-ink border border-hairline shadow-sm font-semibold"
                    : "bg-canvas text-ink-muted hover:text-ink border border-transparent"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
