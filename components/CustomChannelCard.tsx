"use client";

import React from "react";
import Link from "next/link";
import { CustomChannel } from "@/lib/iptv/types";
import { Signal, Play } from "lucide-react";
import { ShowLogo } from "@/components/icons/ShowLogos";

interface CustomChannelCardProps {
  channel: CustomChannel;
  onWatch?: (channel: CustomChannel) => void;
}

export function CustomChannelCard({ channel, onWatch }: CustomChannelCardProps) {
  // Use clean short slug for route URL (e.g. /custom-channels/pokemon, /custom-channels/doraemon)
  const channelSlug = channel.shortSlug || channel.slug || channel.id.replace("-247", "");
  const pageRoute = `/custom-channels/${channelSlug}`;

  return (
    <Link
      href={pageRoute}
      onClick={() => onWatch?.(channel)}
      className="group relative bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-hairline/90 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-semantic-success/15 text-semantic-success border border-semantic-success/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Signal className="w-2.5 h-2.5 animate-pulse" />
            {channel.badge || "24/7 LIVE"}
          </span>

          <span className="text-[11px] font-medium text-ink-muted bg-surface-2 border border-hairline px-2.5 py-0.5 rounded-full">
            {channel.category}
          </span>
        </div>

        {/* Logo & Channel Details */}
        <div className="flex items-start gap-4 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-white border border-hairline flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
            <ShowLogo showId={channel.id} className="w-full h-full object-contain rounded-lg" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-bold text-ink group-hover:text-white transition-colors truncate">
              {channel.name}
            </h3>
            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
              {channel.description}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-3 border-t border-hairline-soft flex items-center justify-between text-xs">
        <span className="text-ink-muted font-medium flex items-center gap-1 text-[11px]">
          24/7 Continuous Broadcast
        </span>

        <span className="inline-flex items-center gap-1.5 bg-surface-2 hover:bg-hairline text-ink font-semibold px-4 py-1.5 rounded-full border border-hairline transition-all active:scale-95 shadow-sm group-hover:bg-ink group-hover:text-canvas">
          <Play className="w-3 h-3 fill-current" />
          <span>Watch 24/7</span>
        </span>
      </div>
    </Link>
  );
}
