"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Channel } from "@/lib/iptv/types";
import { ChannelLogo } from "./ChannelLogo";
import { Search, X, Tv, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
}

export function QuickSearchModal({
  isOpen,
  onClose,
  channels,
}: QuickSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuse.js search index
  const fuse = useMemo(() => {
    return new Fuse(channels, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "network", weight: 0.2 },
        { name: "countryName", weight: 0.2 },
        { name: "categoryNames", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
  }, [channels]);

  // Results calculation
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show top 8 popular/featured channels when search is empty
      return channels.slice(0, 8);
    }
    return fuse.search(query.trim()).map((res) => res.item).slice(0, 10);
  }, [channels, fuse, query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, results.length - 1) : prev - 1
        );
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        const selected = results[selectedIndex];
        router.push(`/channel/${encodeURIComponent(selected.id)}`);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-surface-1 border border-hairline rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Header Input */}
        <div className="relative flex items-center border-b border-hairline p-4">
          <Search className="w-5 h-5 text-ink-muted shrink-0 ml-1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Quick search channels, networks, countries..."
            className="w-full bg-transparent text-ink placeholder:text-ink-muted text-base px-3 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-ink-muted hover:text-ink shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[11px] font-mono text-ink-muted bg-surface-2 border border-hairline px-2 py-0.5 rounded">
              ESC to exit
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-hairline-soft">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-ink-muted uppercase tracking-wider flex items-center justify-between">
            <span>{query ? "Search Results" : "Featured Channels"}</span>
            <span className="text-[10px] font-normal text-ink-muted">
              {results.length} channels
            </span>
          </div>

          {results.length > 0 ? (
            results.map((channel, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={channel.id}
                  onClick={() => {
                    router.push(`/channel/${encodeURIComponent(channel.id)}`);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-surface-2 border border-hairline text-ink"
                      : "hover:bg-surface-2/60 text-ink/80"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <ChannelLogo
                      src={channel.logo}
                      name={channel.name}
                      className="w-10 h-10"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-ink truncate">
                          {channel.name}
                        </h4>
                        <span className="text-[10px] font-semibold bg-canvas text-ink-muted border border-hairline px-1.5 py-0.5 rounded-xs shrink-0">
                          {channel.country}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted truncate">
                        {channel.categoryNames.join(", ")}
                        {channel.network ? ` • ${channel.network}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs text-accent-blue font-medium">
                        <span>Play</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-ink" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-ink-muted space-y-2">
              <Tv className="w-8 h-8 mx-auto text-ink-muted/50" />
              <p className="text-sm font-medium">No channels match &quot;{query}&quot;</p>
              <p className="text-xs">Try searching by category, network or country code.</p>
            </div>
          )}
        </div>

        {/* Modal Footer Keyboard Instructions */}
        <div className="bg-canvas border-t border-hairline px-4 py-2.5 flex items-center justify-between text-xs text-ink-muted">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="bg-surface-2 border border-hairline px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="bg-surface-2 border border-hairline px-1.5 py-0.5 rounded text-[10px]">↵</kbd> Select channel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
