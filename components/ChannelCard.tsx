"use client";

import React from "react";
import Link from "next/link";
import { Channel } from "@/lib/iptv/types";
import { ChannelLogo } from "./ChannelLogo";
import { Play, Signal } from "lucide-react";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const primaryCategory = channel.categoryNames[0] || "General";

  return (
    <Link
      href={`/channel/${encodeURIComponent(channel.id)}`}
      className="group relative bg-surface-1 hover:bg-surface-2 border border-hairline hover:border-hairline/80 rounded-lg p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
    >
      <div>
        {/* Card Header: Logo & Country Tag */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <ChannelLogo src={channel.logo} name={channel.name} className="w-12 h-12" />

          <div className="flex items-center gap-1.5 shrink-0">
            {channel.quality && (
              <span className="text-[10px] font-semibold bg-canvas text-ink-muted border border-hairline px-1.5 py-0.5 rounded-xs tracking-wider">
                {channel.quality}
              </span>
            )}
            <span className="text-[11px] font-medium bg-canvas text-ink-muted border border-hairline px-2 py-0.5 rounded-xs">
              {channel.country}
            </span>
          </div>
        </div>

        {/* Channel Info */}
        <h3 className="text-sm font-semibold text-ink line-clamp-1 group-hover:text-accent-blue transition-colors mb-1">
          {channel.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-ink-muted line-clamp-1">
          <span>{primaryCategory}</span>
          {channel.network && (
            <>
              <span className="text-hairline">&bull;</span>
              <span className="truncate">{channel.network}</span>
            </>
          )}
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="mt-4 pt-3 border-t border-hairline-soft flex items-center justify-between text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1 text-[11px]">
          <Signal className="w-3 h-3 text-semantic-success animate-pulse" />
          <span>Live HLS</span>
        </span>

        <span className="inline-flex items-center gap-1 text-ink group-hover:text-accent-blue font-medium transition-colors">
          <span>Watch</span>
          <div className="w-6 h-6 rounded-full bg-white text-black group-hover:bg-accent-blue group-hover:text-black flex items-center justify-center transition-colors">
            <Play className="w-3 h-3 fill-current ml-0.5" />
          </div>
        </span>
      </div>
    </Link>
  );
}
