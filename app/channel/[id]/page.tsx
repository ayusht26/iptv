import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { ChannelStreamPlayer } from "@/components/ChannelStreamPlayer";
import { ChannelLogo } from "@/components/ChannelLogo";
import { ChannelCard } from "@/components/ChannelCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Info, Radio, Signal, Sparkles, Tv } from "lucide-react";
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

  if (!channel) {
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

  const hasStream = (channel.servers && channel.servers.length > 0) || Boolean(channel.streamUrl);

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

      {/* Main Player / Details Chrome Panel */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-3 md:p-6 space-y-6 shadow-2xl">
        {hasStream ? (
          /* Multi-Server Channel Stream Player */
          <ChannelStreamPlayer channel={channel} autoPlay={true} />
        ) : (
          /* No Stream Available Card Placeholder */
          <div className="w-full aspect-video bg-surface-2 rounded-xl border border-hairline p-6 md:p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-inner relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-surface-1 border border-hairline flex items-center justify-center text-ink-muted shadow-md">
              <ChannelLogo src={channel.logo} name={channel.name} className="w-12 h-12" />
            </div>

            <div className="max-w-md space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-canvas text-ink-muted border border-hairline px-3 py-1 rounded-pill">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>No Direct Stream Link Available</span>
              </span>
              <h2 className="text-xl md:text-2xl font-semibold text-ink">{channel.name}</h2>
              <p className="text-xs md:text-sm text-ink-muted leading-relaxed">
                This channel is listed in the IPTV database, but no active broadcast stream URL is currently provided for in-browser playback.
              </p>
            </div>

            {channel.website && (
              <a
                href={channel.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-semibold px-5 py-2.5 rounded-pill transition-all active:scale-95 shadow-lg pt-2"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Official Channel Website</span>
              </a>
            )}
          </div>
        )}

        {/* Channel Details Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="flex items-start gap-4">
            <ChannelLogo
              src={channel.logo}
              name={channel.name}
              className="w-14 h-14 md:w-16 md:h-16"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="display-md text-ink font-semibold">
                  {channel.name}
                </h1>
                {channel.hasDlhd && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-accent-blue/15 text-accent-blue border border-accent-blue/30 px-2 py-0.5 rounded-full">
                    <Tv className="w-2.5 h-2.5" />
                    DLHD Live Sports
                  </span>
                )}
                {hasStream ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-canvas text-semantic-success border border-hairline px-2 py-0.5 rounded-full">
                    <Signal className="w-2.5 h-2.5 animate-pulse" />
                    Live ({channel.servers.length} Feeds Available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-canvas text-ink-muted border border-hairline px-2 py-0.5 rounded-full">
                    Metadata Only
                  </span>
                )}
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

      {/* Stream Buffering Disclaimer Notice */}
      <div className="bg-surface-1/80 border border-hairline rounded-xl p-4 flex items-center gap-3.5 text-xs text-ink-muted shadow-md">
        <div className="w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center shrink-0 text-accent-blue">
          <Info className="w-4 h-4" />
        </div>
        <p className="leading-relaxed">
          <strong className="text-ink font-semibold">Live Stream Note:</strong> Some channels may buffer for the initial 5–6 seconds while connecting to external broadcast servers and loading stream fragments before playing smoothly.
        </p>
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
