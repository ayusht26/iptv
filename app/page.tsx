import React from "react";
import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { HomeHeroActions } from "@/components/HomeHeroActions";
import { HeroShowcaseGraphic } from "@/components/HeroShowcaseGraphic";
import { GradientSpotlightCard } from "@/components/GradientSpotlightCard";
import { ChannelCard } from "@/components/ChannelCard";
import Link from "next/link";
import { ArrowRight, Tv, Radio, Sparkles } from "lucide-react";

export const revalidate = 21600;

export default async function HomePage() {
  const { channels } = await fetchIPTVData();

  // Top featured popular channels for the home preview grid
  const featuredChannels = channels.slice(0, 8);

  return (
    <div className="w-full space-y-16 py-6 md:py-12">
      {/* Hero Section (Panel Reader layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline, Subhead, CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-surface-1 border border-hairline px-3.5 py-1.5 rounded-pill text-xs text-ink-muted shadow-sm">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
            <span>Over 10,000 Public Live Streams</span>
          </div>

          <h1 className="display-xxl tracking-tight text-ink font-medium leading-[0.9]">
            Watch TV. <br />
            <span className="text-ink-muted">Anywhere.</span>
          </h1>

          <p className="text-base md:text-lg text-ink-muted leading-relaxed max-w-xl">
            A clean, focused live streaming experience. Browse thousands of publicly available live channels by category and country — no account needed.
          </p>

          <HomeHeroActions />
        </div>

        {/* Right Column: 3D Tilted Card Stack Graphic */}
        <div className="lg:col-span-5">
          <HeroShowcaseGraphic channels={channels} />
        </div>
      </section>

      {/* Signature Spotlight Cards Section */}
      <section className="space-y-4 pt-6">
        <div className="flex items-center gap-2 text-ink font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-accent-blue" />
          <h2>Spotlight Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GradientSpotlightCard
            title="Sports & News Live"
            subtitle="Stream high-definition sports, live scores, and global news coverage 24/7."
            category="sports"
            variant="violet"
          />
          <GradientSpotlightCard
            title="Music & Entertainment"
            subtitle="Discover live music broadcasts, concert streams, and continuous cinema feeds."
            category="music"
            variant="magenta"
          />
        </div>
      </section>

      {/* Featured Popular Channels Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-ink font-semibold text-base">
              <Tv className="w-4 h-4 text-accent-blue" />
              <h3>Popular Live Channels</h3>
            </div>
            <p className="text-xs text-ink-muted">
              Handpicked live streams from around the globe.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-blue hover:underline"
          >
            <span>Browse all channels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredChannels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>

        {/* Big Bottom CTA to Browse */}
        <div className="text-center pt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-surface-1 hover:bg-surface-2 border border-hairline text-ink text-sm font-medium px-6 py-3 rounded-pill transition-all active:scale-95 shadow-md"
          >
            <Radio className="w-4 h-4 text-accent-blue" />
            <span>Explore All 10,000+ Channels</span>
            <ArrowRight className="w-4 h-4 text-ink-muted" />
          </Link>
        </div>
      </section>
    </div>
  );
}
