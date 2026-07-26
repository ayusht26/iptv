import React from "react";
import { Channel } from "@/lib/iptv/types";
import { ChannelLogo } from "./ChannelLogo";
import Link from "next/link";
import { Signal, Play } from "lucide-react";

interface HeroShowcaseGraphicProps {
  channels: Channel[];
}

export function HeroShowcaseGraphic({ channels }: HeroShowcaseGraphicProps) {
  // Pick 3 representative channels for the 3D showcase stack
  const sampleChannels = channels.slice(0, 3);

  if (sampleChannels.length < 3) return null;

  return (
    <div className="relative w-full max-w-md mx-auto lg:max-w-none h-[280px] sm:h-[320px] flex items-center justify-center select-none perspective-1000">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Card 1 — Left Tilted */}
      <Link
        href={`/channel/${encodeURIComponent(sampleChannels[0].id)}`}
        className="absolute left-2 sm:left-6 w-44 sm:w-52 bg-surface-1 border border-hairline hover:border-accent-blue/50 rounded-xl p-4 shadow-xl -rotate-6 translate-y-4 hover:translate-y-2 hover:-rotate-3 transition-all duration-300 group z-10"
      >
        <div className="flex items-center justify-between mb-3">
          <ChannelLogo src={sampleChannels[0].logo} name={sampleChannels[0].name} className="w-10 h-10" />
          <span className="text-[10px] font-semibold bg-canvas text-semantic-success border border-hairline px-2 py-0.5 rounded-full flex items-center gap-1">
            <Signal className="w-2.5 h-2.5 animate-pulse" /> Live
          </span>
        </div>
        <h4 className="text-xs font-semibold text-ink truncate group-hover:text-accent-blue">
          {sampleChannels[0].name}
        </h4>
        <p className="text-[11px] text-ink-muted truncate mt-0.5">
          {sampleChannels[0].categoryNames[0] || "General"}
        </p>
      </Link>

      {/* Card 2 — Center Main Featured */}
      <Link
        href={`/channel/${encodeURIComponent(sampleChannels[1].id)}`}
        className="relative w-48 sm:w-56 bg-surface-2 border border-hairline hover:border-accent-blue rounded-xl p-5 shadow-2xl rotate-2 scale-105 hover:scale-110 hover:rotate-0 transition-all duration-300 group z-20"
      >
        <div className="flex items-center justify-between mb-4">
          <ChannelLogo src={sampleChannels[1].logo} name={sampleChannels[1].name} className="w-12 h-12" />
          <div className="w-7 h-7 rounded-full bg-white text-black group-hover:bg-accent-blue flex items-center justify-center shadow-md">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </div>
        </div>
        <h4 className="text-sm font-semibold text-ink truncate group-hover:text-accent-blue">
          {sampleChannels[1].name}
        </h4>
        <div className="flex items-center justify-between text-xs text-ink-muted mt-1">
          <span>{sampleChannels[1].categoryNames[0] || "News"}</span>
          <span className="text-[10px] bg-canvas px-1.5 py-0.5 rounded border border-hairline">
            {sampleChannels[1].country}
          </span>
        </div>
      </Link>

      {/* Card 3 — Right Tilted */}
      <Link
        href={`/channel/${encodeURIComponent(sampleChannels[2].id)}`}
        className="absolute right-2 sm:right-6 w-44 sm:w-52 bg-surface-1 border border-hairline hover:border-accent-blue/50 rounded-xl p-4 shadow-xl rotate-6 -translate-y-2 hover:translate-y-0 hover:rotate-3 transition-all duration-300 group z-10"
      >
        <div className="flex items-center justify-between mb-3">
          <ChannelLogo src={sampleChannels[2].logo} name={sampleChannels[2].name} className="w-10 h-10" />
          <span className="text-[10px] font-semibold bg-canvas text-ink-muted border border-hairline px-2 py-0.5 rounded-full">
            {sampleChannels[2].country}
          </span>
        </div>
        <h4 className="text-xs font-semibold text-ink truncate group-hover:text-accent-blue">
          {sampleChannels[2].name}
        </h4>
        <p className="text-[11px] text-ink-muted truncate mt-0.5">
          {sampleChannels[2].categoryNames[0] || "Sports"}
        </p>
      </Link>
    </div>
  );
}
