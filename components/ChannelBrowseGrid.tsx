"use client";

import React, { useState, useMemo, useDeferredValue, useTransition } from "react";
import Fuse from "fuse.js";
import { Channel, Category, Country } from "@/lib/iptv/types";
import { ChannelCard } from "./ChannelCard";
import { FilterBar } from "./FilterBar";
import { ChannelCardSkeleton } from "./ChannelCardSkeleton";
import { Search, Tv, X, ChevronDown, Sparkles } from "lucide-react";

interface ChannelBrowseGridProps {
  channels: Channel[];
  categories: Category[];
  countries: Country[];
  initialCategory?: string;
  initialCountry?: string;
}

const ITEMS_PER_PAGE = 48;

export function ChannelBrowseGrid({
  channels,
  categories,
  countries,
  initialCategory = "",
  initialCountry = "",
}: ChannelBrowseGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isPending] = useTransition();

  // Initialize Fuse.js index for fast fuzzy search over channel name, network, country
  const fuse = useMemo(() => {
    return new Fuse(channels, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "network", weight: 0.2 },
        { name: "countryName", weight: 0.2 },
        { name: "country", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [channels]);

  // Non-blocking fuzzy search + category/country filter using deferredSearchQuery
  const filteredChannels = useMemo(() => {
    let result = channels;

    const trimmedSearch = deferredSearchQuery.trim();
    if (trimmedSearch.length > 0) {
      result = fuse.search(trimmedSearch).map((res) => res.item);
    }

    if (initialCategory) {
      const lowerCat = initialCategory.toLowerCase();
      result = result.filter((c) =>
        c.categories.some((cat) => cat.toLowerCase() === lowerCat)
      );
    }

    if (initialCountry) {
      const upperCountry = initialCountry.toUpperCase();
      result = result.filter((c) => c.country.toUpperCase() === upperCountry);
    }

    return result;
  }, [channels, fuse, deferredSearchQuery, initialCategory, initialCountry]);

  // Paginated channels to render
  const displayedChannels = useMemo(() => {
    return filteredChannels.slice(0, visibleCount);
  }, [filteredChannels, visibleCount]);

  const hasMore = visibleCount < filteredChannels.length;
  const isSearching = searchQuery !== deferredSearchQuery;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="w-full space-y-10">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 space-y-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 bg-surface-1 border border-hairline px-3.5 py-1.5 rounded-pill text-xs text-ink-muted shadow-sm">
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span>Over 10,000 Live Public Streams</span>
        </div>

        <h1 className="display-xxl tracking-tight text-ink font-medium">
          Thousands of channels. <br />
          <span className="text-ink-muted">One clean tab.</span>
        </h1>

        <p className="text-base md:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
          Browse, filter, and stream publicly available live TV channels by category and country in an in-browser HLS player.
        </p>

        {/* Hero Search Bar */}
        <div className="relative max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-ink-muted absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              placeholder="Search channels, networks, or countries (e.g. BBC, News, Sports)..."
              className="w-full bg-surface-1 text-ink placeholder:text-ink-muted/60 text-sm md:text-base border border-hairline hover:border-hairline/80 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue rounded-pill pl-12 pr-10 py-3.5 focus:outline-none transition-all shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="absolute right-4 p-1 text-ink-muted hover:text-ink"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-ink-muted px-4 pt-2">
            <span>
              Showing {filteredChannels.length.toLocaleString()} matching channels
            </span>
            {isSearching && (
              <span className="inline-flex items-center gap-1.5 text-accent-blue">
                <Sparkles className="w-3 h-3 animate-spin" />
                Filtering...
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div id="browse" className="scroll-mt-20">
        <FilterBar
          categories={categories}
          countries={countries}
          selectedCategory={initialCategory}
          selectedCountry={initialCountry}
        />
      </div>

      {/* Channel Grid with Skeleton Loading */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ChannelCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredChannels.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>

          {/* Load More Pagination Button */}
          {hasMore && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 bg-surface-1 hover:bg-surface-2 border border-hairline text-ink font-medium text-sm px-6 py-3 rounded-pill transition-all active:scale-95 shadow-md"
              >
                <span>Load More Channels</span>
                <ChevronDown className="w-4 h-4 text-ink-muted" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-1 border border-hairline rounded-xl p-12 text-center space-y-4 max-w-md mx-auto my-12 shadow-md">
          <div className="w-14 h-14 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-ink-muted mx-auto">
            <Tv className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-ink">No channels found</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            We couldn&apos;t find any active channels matching your search or filters. Try resetting your filter criteria or searching for a different channel.
          </p>
        </div>
      )}
    </div>
  );
}
