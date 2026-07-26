"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tv, Menu, X, Play } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Browse", href: "/" },
    { label: "Categories", href: "/#categories" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-canvas/90 backdrop-blur-md border-b border-hairline-soft h-[56px] flex items-center">
      <div className="max-w-[1200px] w-full mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-ink group-hover:border-accent-blue/50 transition-colors">
            <Tv className="w-4 h-4 text-ink" />
          </div>
          <span className="font-display text-lg font-medium tracking-tight text-ink">
            IPTV<span className="text-ink-muted">Only</span>
          </span>
        </Link>

        {/* Center: Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href.startsWith("/#")
                ? false
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-ink font-semibold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA Pair */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ayusht26/iptv"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-surface-1 hover:bg-surface-2 text-ink text-xs font-medium px-3.5 py-2 rounded-pill border border-hairline transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <Link
            href="/#browse"
            className="inline-flex items-center gap-2 bg-ink hover:bg-ink/90 text-on-primary text-xs font-medium px-4 py-2 rounded-pill transition-transform active:scale-95 shadow-sm"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Watch now</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-muted hover:text-ink focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[56px] inset-x-0 bg-canvas/98 border-b border-hairline p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-ink hover:text-accent-blue py-2 border-b border-hairline-soft"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/ayusht26/iptv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-surface-1 text-ink text-sm font-medium px-4 py-2.5 rounded-pill border border-hairline mt-2"
          >
            <GithubIcon className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      )}
    </header>
  );
}
