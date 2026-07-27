"use client";

import React, { useState } from "react";
import { SHOWS_DATA, getShowBySlug } from "@/lib/iptv/custom-shows-data";
import { Tv } from "lucide-react";

export function RealShowLogo({ showId, className = "w-full h-full" }: { showId: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const show = getShowBySlug(showId);
  const imageUrl = show?.imageUrl;

  if (!imageUrl || hasError) {
    return (
      <div className={`flex items-center justify-center bg-white text-black rounded-xl ${className}`}>
        <Tv className="w-5 h-5 text-gray-500" />
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={show?.name || "Show Logo"}
      onError={() => setHasError(true)}
      className={`object-contain rounded-xl ${className}`}
      loading="lazy"
    />
  );
}

export function ShowLogo({ showId, className = "w-full h-full" }: { showId: string; className?: string }) {
  return <RealShowLogo showId={showId} className={className} />;
}

export function getShowLogo(showId: string, className = "w-full h-full") {
  return <RealShowLogo showId={showId} className={className} />;
}

