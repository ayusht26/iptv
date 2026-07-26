"use client";

import React, { useState } from "react";
import { Tv } from "lucide-react";

interface ChannelLogoProps {
  src: string | null;
  name: string;
  className?: string;
}

export function ChannelLogo({ src, name, className = "w-12 h-12" }: ChannelLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Generate initials from channel name
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  if (!src || hasError) {
    return (
      <div
        className={`${className} bg-surface-1 border border-hairline rounded-lg flex flex-col items-center justify-center text-ink select-none shrink-0 overflow-hidden shadow-inner p-1`}
        title={name}
      >
        {initials ? (
          <span className="text-xs font-bold tracking-wider text-ink-muted">
            {initials}
          </span>
        ) : (
          <Tv className="w-5 h-5 text-ink-muted" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-surface-1 border border-hairline rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0 relative`}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}
