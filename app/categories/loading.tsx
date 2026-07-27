import React from "react";
import { ChannelCardSkeleton } from "@/components/ChannelCardSkeleton";
import { Search } from "lucide-react";

export default function CategoriesLoading() {
  return (
    <div className="py-2">
      <div className="w-full space-y-10">
        {/* Hero Section Skeleton */}
        <section className="text-center py-6 md:py-10 space-y-4 max-w-5xl mx-auto px-4">
          {/* Badge skeleton */}
          <div className="inline-flex items-center gap-2 bg-surface-1 border border-hairline px-3.5 py-1.5 rounded-pill">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
            <span className="text-xs text-ink-muted">
              Over 38,000 Public Live Channels
            </span>
          </div>

          {/* Title skeleton */}
          <h1 className="display-xl md:display-xxl tracking-tight text-ink font-medium leading-[0.95] md:leading-[0.88]">
            <span className="inline-block">Thousands of channels.</span>{" "}
            <br className="hidden md:block" />
            <span className="text-ink-muted inline-block">One clean tab.</span>
          </h1>

          <p className="text-sm md:text-base text-ink-muted max-w-xl mx-auto leading-relaxed">
            Browse, filter, and stream publicly available live TV channels by
            category and country in an in-browser HLS player.
          </p>

          {/* Search bar skeleton */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-ink-muted absolute left-4 pointer-events-none" />
              <div className="w-full bg-surface-1 border border-hairline rounded-pill pl-12 pr-10 py-3.5 shadow-lg">
                <span className="text-ink-muted/60 text-sm">
                  Search channels, networks, or countries...
                </span>
              </div>
            </div>
            <div className="flex items-center text-xs text-ink-muted px-4 pt-2">
              <div className="h-3 w-48 bg-surface-2 rounded animate-pulse" />
            </div>
          </div>
        </section>

        {/* Filter Bar Skeleton */}
        <div className="w-full flex flex-col gap-4 py-4">
          {/* Top row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-surface-2 rounded animate-pulse" />
              <div className="h-3 w-24 bg-surface-2 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-36 bg-surface-1 border border-hairline rounded-md animate-pulse" />
            </div>
          </div>
          {/* Category pills skeleton */}
          <div className="flex items-center gap-2 overflow-hidden py-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 h-8 bg-surface-1 border border-hairline rounded-pill animate-pulse"
                style={{ width: `${60 + Math.random() * 40}px` }}
              />
            ))}
          </div>
        </div>

        {/* Channel Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ChannelCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
