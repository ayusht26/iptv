import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChannelLogo } from "@/components/ChannelLogo";
import { ChannelCard } from "@/components/ChannelCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Radio, Signal, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 21600;

interface ChannelPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ChannelPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const { channels } = await fetchIPTVData();
  const channel = channels.find((c) => c.id === decodedId);

  if (!channel) {
    return {
      title: "Channel Not Found — IPTV Only",
    };
  }

  return {
    title: `${channel.name} Live Stream — IPTV Only`,
    description: `Watch ${channel.name} live in your browser. ${channel.categoryNames.join(
      ", "
    )} channel from ${channel.countryName}.`,
    openGraph: {
      title: `${channel.name} — IPTV Only`,
      description: `Watch ${channel.name} live stream.`,
      images: channel.logo ? [{ url: channel.logo }] : [],
    },
  };
}

export default async function ChannelWatchPage({ params }: ChannelPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const { channels } = await fetchIPTVData();

  const channel = channels.find((c) => c.id === decodedId);

  if (!channel || !channel.streamUrl) {
    notFound();
  }

  // Find related channels in the same primary category
  const primaryCategory = channel.categories[0];
  const relatedChannels = channels
    .filter(
      (c) =>
        c.id !== channel.id &&
        c.categories.some((cat) => cat === primaryCategory)
    )
    .slice(0, 4);

  return (
    <div className="w-full space-y-8 py-4">
      {/* Back button link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-ink-muted hover:text-ink transition-colors bg-surface-1 hover:bg-surface-2 px-3.5 py-2 rounded-pill border border-hairline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Channel Browse</span>
        </Link>
      </div>

      {/* Main Player Chrome Panel (product-mockup-tile style) */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-3 md:p-6 space-y-6 shadow-2xl">
        {/* HLS Video Player */}
        <VideoPlayer
          src={channel.streamUrl}
          channelName={channel.name}
          autoPlay={true}
        />

        {/* Channel Details Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="flex items-start gap-4">
            <ChannelLogo
              src={channel.logo}
              name={channel.name}
              className="w-14 h-14 md:w-16 md:h-16"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="display-md text-ink font-semibold">
                  {channel.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-canvas text-semantic-success border border-hairline px-2 py-0.5 rounded-full">
                  <Signal className="w-2.5 h-2.5 animate-pulse" />
                  Live HLS
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                {channel.network && (
                  <span className="inline-flex items-center gap-1 font-medium text-ink">
                    <Radio className="w-3.5 h-3.5 text-accent-blue" />
                    {channel.network}
                  </span>
                )}
                <span>&bull;</span>
                <span>{channel.countryName} ({channel.country})</span>
                {channel.categoryNames.length > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="text-accent-blue">
                      {channel.categoryNames.join(", ")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* External Links */}
          {channel.website && (
            <a
              href={channel.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-ink bg-surface-2 hover:bg-hairline px-4 py-2.5 rounded-pill border border-hairline transition-colors shrink-0 self-start md:self-center"
            >
              <Globe className="w-3.5 h-3.5 text-ink-muted" />
              <span>Official Website</span>
            </a>
          )}
        </div>
      </div>

      {/* More Like This Section */}
      {relatedChannels.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center gap-2 border-b border-hairline-soft pb-3">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <h2 className="text-base font-semibold text-ink">
              More Channels in {channel.categoryNames[0] || "Category"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedChannels.map((relChannel) => (
              <ChannelCard key={relChannel.id} channel={relChannel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
