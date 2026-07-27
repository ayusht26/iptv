import React from "react";
import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { getPopularChannels } from "@/lib/iptv/popular-channels";
import { HomeHeroActions } from "@/components/HomeHeroActions";
import { ChannelCard } from "@/components/ChannelCard";
import Link from "next/link";
import { ArrowRight, Tv, Radio } from "lucide-react";

export const revalidate = 21600;

export default async function HomePage() {
  const { channels } = await fetchIPTVData();

  // Top featured popular channels for the home preview grid using popular scoring system
  const featuredChannels = getPopularChannels(channels, 12);

  return (
    <div className="w-full space-y-16 py-8 md:py-16">
      {/* Clean & Aesthetic Centered Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 px-4">
        <div className="inline-flex items-center gap-2 bg-surface-1 border border-hairline px-3.5 py-1.5 rounded-pill text-xs text-ink-muted shadow-sm">
          <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
          <span>Over 39,000 Live Sports & TV Channels</span>
        </div>

        <h1 className="display-xxl tracking-tight text-ink font-medium leading-[0.9]">
          Watch Sports & TV. <br />
          <span className="text-ink-muted">Anywhere.</span>
        </h1>

        <p className="text-base md:text-lg text-ink-muted leading-relaxed max-w-xl mx-auto">
          A clean, focused live streaming experience. Stream thousands of sports and live channels across multiple server feeds — no account needed.
        </p>

        <div className="flex justify-center">
          <HomeHeroActions />
        </div>
      </section>

      {/* Featured Popular Channels Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-hairline-soft pb-4">
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

        {/* Bottom CTA to Categories */}
        <div className="text-center pt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-surface-1 hover:bg-surface-2 border border-hairline text-ink text-sm font-medium px-6 py-3 rounded-pill transition-all active:scale-95 shadow-md"
          >
            <Radio className="w-4 h-4 text-accent-blue" />
            <span>Explore All 38,000+ Channels</span>
            <ArrowRight className="w-4 h-4 text-ink-muted" />
          </Link>
        </div>
      </section>
    </div>
  );
}
