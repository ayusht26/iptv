"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import { CustomChannel } from "@/lib/iptv/types";
import { CustomChannelCard } from "./CustomChannelCard";
import { Search, X, Sparkles, SlidersHorizontal, Film, ShieldAlert } from "lucide-react";

interface CustomChannelsBrowseGridProps {
  channels: CustomChannel[];
}

const CATEGORIES = ["All", "Cartoons", "Anime", "Classics"];

export function CustomChannelsBrowseGrid({ channels }: CustomChannelsBrowseGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter channels
  const filteredChannels = useMemo(() => {
    const query = deferredSearchQuery.trim().toLowerCase();
    return channels.filter((c) => {
      if (activeCategory !== "All" && c.category !== activeCategory) return false;
      if (query.length > 0) {
        const searchBlob = `${c.name} ${c.description} ${c.category}`.toLowerCase();
        if (!searchBlob.includes(query)) return false;
      }
      return true;
    });
  }, [channels, deferredSearchQuery, activeCategory]);

  return (
    <div className="w-full space-y-8">
      {/* Dark Theme Header Bar */}
      <section className="space-y-3 py-4 border-b border-hairline-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-surface-1 border border-hairline px-3.5 py-1 rounded-full text-xs font-medium text-ink-muted">
              <Sparkles className="w-3.5 h-3.5 text-ink-muted" />
              <span>Custom 24/7 Channels</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
              Custom 24/7 Live Channels
            </h1>
            <p className="text-xs md:text-sm text-ink-muted leading-relaxed max-w-xl">
              Watch non-stop 24/7 cartoon & anime streams. Click any channel to open its dedicated 24/7 broadcast player.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search custom channels..."
              className="w-full bg-surface-1 text-ink placeholder:text-ink-muted/60 text-xs md:text-sm border border-hairline hover:border-hairline/80 focus:border-hairline rounded-full pl-10 pr-8 py-2.5 focus:outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer / External Sources & AdBlocker Notice Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200/90 text-xs shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-semibold text-amber-300 block">External Source Disclaimer & Ad-Blocker Suggestion</span>
            <p className="text-amber-200/80">
              Streams on custom 24/7 channels are fetched from external third-party servers and may trigger popups or ads.
              We recommend using a trusted ad-blocker like{" "}
              <a
                href="https://ublockorigin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold hover:text-white transition-colors"
              >
                uBlock Origin
              </a>{" "}
              for a seamless, ad-free viewing experience.
            </p>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-ink-muted" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Filter:
            </span>
          </div>

          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-surface-2 text-ink border border-hairline shadow-sm"
                    : "bg-surface-1 text-ink-muted hover:text-ink border border-hairline/60 hover:bg-surface-2/40"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Channels Directory Grid */}
      <section className="space-y-4">
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredChannels.map((channel) => (
              <CustomChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-1 border border-hairline rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 shadow-md">
            <Film className="w-10 h-10 text-ink-muted mx-auto" />
            <h3 className="text-lg font-bold text-ink">No Custom Channels Found</h3>
            <p className="text-xs text-ink-muted">
              No channels match your current search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="inline-flex items-center gap-2 bg-surface-2 hover:bg-hairline text-ink text-xs font-semibold px-4 py-2 rounded-full border border-hairline transition-colors"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
