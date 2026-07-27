"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tv, Menu, X, Search, Home, Grid, Info, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

interface TopNavProps {
  onOpenSearch?: () => void;
}

export function TopNav({ onOpenSearch }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Categories", url: "/categories", icon: Grid },
    { name: "Custom Channels", url: "/custom-channels", icon: Sparkles },
    { name: "About", url: "/about", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/95 backdrop-blur-md border-b border-hairline-soft h-[56px] flex items-center">
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Logo (Exact match with original design) */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-ink group-hover:border-hairline/80 transition-all shadow-sm">
            <Tv className="w-4 h-4 text-ink" />
          </div>
          <span className="font-display text-lg font-medium tracking-tight text-ink">
            IPTV<span className="text-ink-muted">Only</span>
          </span>
        </Link>

        {/* Center: Floating Nav Items Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-1 border border-hairline px-2 py-1 rounded-full shadow-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname.startsWith(item.url);

            return (
              <Link
                key={item.name}
                href={item.url}
                className={`relative flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
                  isActive
                    ? "bg-surface-2 text-ink border border-hairline shadow-sm"
                    : "text-ink-muted hover:text-ink hover:bg-surface-2/40"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-ink" : "text-ink-muted"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search & GitHub */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Desktop Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2.5 bg-surface-1 hover:bg-surface-2 text-ink-muted hover:text-ink text-xs font-normal px-3.5 py-1.5 rounded-full border border-hairline transition-all shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-ink-muted" />
            <span>Search channels...</span>
            <kbd className="text-[10px] font-mono bg-surface-2 text-ink-muted border border-hairline px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Mobile Search Icon */}
          <button
            onClick={onOpenSearch}
            aria-label="Open search"
            className="sm:hidden p-2 text-ink-muted hover:text-ink rounded-full bg-surface-1 border border-hairline"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* GitHub Button */}
          <a
            href="https://github.com/ayusht26/iptv"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium px-3.5 py-1.5 rounded-full border border-hairline transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-muted hover:text-ink rounded-full bg-surface-1 border border-hairline"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[56px] inset-x-0 bg-canvas/98 border-b border-hairline p-5 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200 shadow-2xl z-50 backdrop-blur-2xl">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch?.();
            }}
            className="flex items-center justify-between bg-surface-1 text-ink-muted text-xs px-4 py-3 rounded-xl border border-hairline"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-ink-muted" />
              <span>Search channels...</span>
            </span>
            <kbd className="text-[10px] bg-surface-2 border border-hairline px-2 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>

          <div className="flex flex-col gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.url);

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-sm font-semibold px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-surface-2 text-ink border border-hairline"
                      : "text-ink-muted hover:text-ink hover:bg-surface-1"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <a
            href="https://github.com/ayusht26/iptv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-surface-1 text-ink text-xs font-semibold px-4 py-3 rounded-xl border border-hairline mt-1"
          >
            <GithubIcon className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      )}
    </header>
  );
}
