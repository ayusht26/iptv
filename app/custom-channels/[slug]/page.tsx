import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoraemonStreamPlayer } from "@/components/DoraemonStreamPlayer";
import { CustomChannelCard } from "@/components/CustomChannelCard";
import { getShowBySlug, SHOWS_DATA } from "@/lib/iptv/custom-shows-data";
import { ShowLogo } from "@/components/icons/ShowLogos";
import { CustomChannel } from "@/lib/iptv/types";
import { ChevronRight, Signal, Sparkles, Tv } from "lucide-react";

interface DedicatedChannelPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: DedicatedChannelPageProps) {
  const { slug } = await params;
  const show = getShowBySlug(slug);
  return {
    title: `${show.name} - Watch 24/7 Live Stream | IPTV Only`,
    description: show.description,
  };
}

export default async function DedicatedCustomChannelPage({ params }: DedicatedChannelPageProps) {
  const { slug } = await params;
  const show = getShowBySlug(slug);

  if (!show) {
    notFound();
  }

  const channel: CustomChannel = {
    id: show.id,
    slug: show.shortSlug,
    shortSlug: show.shortSlug,
    name: show.name,
    description: show.description,
    logo: show.imageUrl || null,
    category: show.category,
    badge: "24/7 LIVE",
    is247: true,
    featured: true,
    sourceUrl: show.sourceUrl,
    episodes: [],
  };

  // Filter related custom channels (excluding current channel)
  const relatedChannels: CustomChannel[] = Object.values(SHOWS_DATA)
    .filter((s) => s.id !== show.id)
    .map((s) => ({
      id: s.id,
      slug: s.shortSlug,
      shortSlug: s.shortSlug,
      name: s.name,
      description: s.description,
      logo: s.imageUrl || null,
      category: s.category,
      badge: "24/7 LIVE",
      is247: true,
      featured: false,
      sourceUrl: s.sourceUrl,
      episodes: [],
    }));

  return (
    <div className="space-y-6 md:space-y-8 py-2">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-hairline" />
        <Link href="/custom-channels" className="hover:text-ink transition-colors">
          Custom Channels
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-hairline" />
        <span className="text-ink font-semibold">{show.name}</span>
      </nav>

      {/* Channel Hero Title Header */}
      <header className="bg-surface-1 border border-hairline rounded-2xl p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start md:items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-hairline flex items-center justify-center p-2 shrink-0 shadow-inner overflow-hidden">
            <ShowLogo showId={show.id} className="w-full h-full object-contain rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-ink">
                {show.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-semantic-success/15 text-semantic-success border border-semantic-success/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <Signal className="w-3 h-3 animate-pulse" />
                24/7 LIVE BROADCAST
              </span>
            </div>
            <p className="text-xs md:text-sm text-ink-muted leading-relaxed max-w-2xl">
              {show.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-ink-muted bg-surface-2 border border-hairline px-3.5 py-1.5 rounded-full">
            {show.category}
          </span>
        </div>
      </header>

      {/* Main 24/7 Stream Player */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wider flex items-center gap-2">
            <Tv className="w-4 h-4 text-ink" />
            <span>Live Broadcast Player</span>
          </h2>
        </div>

        <DoraemonStreamPlayer channel={channel} />
      </section>

      {/* Related 24/7 Channels Section */}
      <section className="space-y-4 pt-6 border-t border-hairline-soft">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ink-muted" />
              <span>More 24/7 Custom Channels</span>
            </h2>
            <p className="text-xs text-ink-muted">
              Switch to another 24/7 continuous cartoon or anime channel.
            </p>
          </div>

          <Link
            href="/custom-channels"
            className="text-xs font-semibold text-ink-muted hover:text-ink bg-surface-1 hover:bg-surface-2 px-4 py-2 rounded-full border border-hairline transition-all"
          >
            View All Channels
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {relatedChannels.map((relChannel) => (
            <CustomChannelCard key={relChannel.id} channel={relChannel} />
          ))}
        </div>
      </section>
    </div>
  );
}
