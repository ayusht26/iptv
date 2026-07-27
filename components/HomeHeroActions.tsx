"use client";

import React from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";

export function HomeHeroActions() {
  const triggerQuickSearch = () => {
    // Dispatch custom event or keyboard event to open QuickSearchModal
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        ctrlKey: true,
        bubbles: true,
      })
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
      {/* Primary White Pill CTA: Browse all channels */}
      <Link
        href="/categories"
        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black text-sm font-semibold px-5 py-3 rounded-pill transition-transform active:scale-95 shadow-lg w-full sm:w-auto"
      >
        <Search className="w-4 h-4 text-black" />
        <span>Browse all channels</span>
      </Link>

      {/* Secondary Charcoal Pill CTA: Quick search [⌘K] */}
      <button
        onClick={triggerQuickSearch}
        className="inline-flex items-center justify-center gap-2 bg-surface-1 hover:bg-surface-2 text-ink border border-hairline text-sm font-medium px-5 py-3 rounded-pill transition-all active:scale-95 shadow-sm w-full sm:w-auto"
      >
        <Sparkles className="w-4 h-4 text-accent-blue" />
        <span>Quick search</span>
        <kbd className="text-[10px] font-mono bg-surface-2 text-ink-muted border border-hairline px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </button>
    </div>
  );
}
