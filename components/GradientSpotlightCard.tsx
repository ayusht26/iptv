"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface GradientSpotlightCardProps {
  title: string;
  subtitle: string;
  category: string;
  variant?: "violet" | "magenta" | "orange";
  onSelectCategory?: (category: string) => void;
}

export function GradientSpotlightCard({
  title,
  subtitle,
  category,
  variant = "violet",
  onSelectCategory,
}: GradientSpotlightCardProps) {
  const gradientStyles = {
    violet: "bg-gradient-to-br from-[#6a4cf5] via-[#5233e4] to-[#3a1eb8]",
    magenta: "bg-gradient-to-br from-[#d44df0] via-[#b32dd0] to-[#8d14ab]",
    orange: "bg-gradient-to-br from-[#ff7a3d] via-[#e5591c] to-[#c43a00]",
  };

  return (
    <div
      onClick={() => onSelectCategory && onSelectCategory(category)}
      className={`group cursor-pointer ${gradientStyles[variant]} rounded-xl p-6 flex flex-col justify-between text-ink relative overflow-hidden transition-transform duration-200 hover:-translate-y-1 shadow-lg border border-white/10`}
    >
      {/* Decorative Glow Circle */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-pill text-xs font-semibold text-white/90 mb-4 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Spotlight Collection</span>
        </div>

        <h3 className="font-display text-2xl font-medium leading-tight tracking-tight text-white mb-2">
          {title}
        </h3>

        <p className="text-xs text-white/80 leading-relaxed font-normal">
          {subtitle}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
        <span className="text-xs font-medium text-white/90">
          Filter by {category}
        </span>
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
