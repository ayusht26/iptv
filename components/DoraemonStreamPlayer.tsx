"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { CustomChannel } from "@/lib/iptv/types";
import { getShowBySlug } from "@/lib/iptv/custom-shows-data";
import { Signal, Shuffle, Tv, X, Loader2, Server, Check, ListVideo, Play, ShieldAlert } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

interface StreamServerOption {
  name: string;
  url: string;
}

interface DoraemonStreamPlayerProps {
  channel: CustomChannel;
  onClose?: () => void;
}

// Watchdog timer (21 mins) to auto-transition episodes for 24/7 stream loop
const DEFAULT_EPISODE_AUTO_NEXT_MS = 21 * 60 * 1000;

function formatAutoplayUrl(url: string): string {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1&autoPlay=true&autostart=true`;
}

export function DoraemonStreamPlayer({ channel, onClose }: DoraemonStreamPlayerProps) {
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>("");
  const [servers, setServers] = useState<StreamServerOption[]>([]);
  const [activeServerIndex, setActiveServerIndex] = useState<number>(0);
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(true);
  const [streamKey, setStreamKey] = useState<number>(0);
  const [showServerDropdown, setShowServerDropdown] = useState<boolean>(false);
  
  // Episode Selection State
  const [playingSeason, setPlayingSeason] = useState<number | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  
  const showConfig = getShowBySlug(channel.id);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    showConfig.seasons[0]?.season || 1
  );

  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch stream (either random or specific season & episode)
  const fetchEpisodeStream = useCallback(async (seasonNum?: number, epNum?: number) => {
    setIsLoadingStream(true);
    setShowServerDropdown(false);
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }

    try {
      let query = `/api/doraemon-stream?show=${channel.id}`;
      if (seasonNum !== undefined && epNum !== undefined) {
        query += `&season=${seasonNum}&episode=${epNum}`;
      }

      const res = await fetch(query, { cache: "no-store" });
      const data = await res.json();
      if (data && data.streamUrl) {
        setCurrentStreamUrl(data.streamUrl);
        setServers(data.servers || [{ name: "Server 1 (Primary HD)", url: data.streamUrl }]);
        setActiveServerIndex(0);
        setStreamKey((prev) => prev + 1);
        if (data.season) setPlayingSeason(data.season);
        if (data.episode) setPlayingEpisode(data.episode);
      }
    } catch (err) {
      console.error("Error fetching episode stream:", err);
    } finally {
      setIsLoadingStream(false);
    }
  }, [channel.id]);

  const fetchNextRandomEpisode = useCallback(() => {
    fetchEpisodeStream();
  }, [fetchEpisodeStream]);

  // Initial random stream fetch on tune-in
  useEffect(() => {
    fetchNextRandomEpisode();
  }, [fetchNextRandomEpisode]);

  // Auto-next episode watchdog timer
  useEffect(() => {
    if (!currentStreamUrl) return;

    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
    }

    autoNextTimerRef.current = setTimeout(() => {
      console.log("⏰ Watchdog timer completed. Loading next random episode...");
      fetchNextRandomEpisode();
    }, DEFAULT_EPISODE_AUTO_NEXT_MS);

    return () => {
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }
    };
  }, [currentStreamUrl, fetchNextRandomEpisode]);

  // Listen to postMessage from embedded iframe players
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      try {
        const msgStr = typeof event.data === "string" ? event.data.toLowerCase() : JSON.stringify(event.data).toLowerCase();

        if (
          msgStr.includes("ended") ||
          msgStr.includes("finish") ||
          msgStr.includes("complete") ||
          msgStr.includes("statechange\":0") ||
          msgStr.includes("state\":0") ||
          event.data.event === "ended" ||
          event.data.type === "ended"
        ) {
          console.log("🎬 Video ended event received. Loading next random episode...");
          fetchNextRandomEpisode();
        }
      } catch (err) {
        // Ignore JSON stringify errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [fetchNextRandomEpisode]);

  const handleSelectServer = (index: number) => {
    if (!servers[index]) return;
    setActiveServerIndex(index);
    setCurrentStreamUrl(servers[index].url);
    setStreamKey((prev) => prev + 1);
    setShowServerDropdown(false);
  };

  const handleSelectSpecificEpisode = (season: number, episode: number) => {
    setDrawerOpen(false);
    fetchEpisodeStream(season, episode);
  };

  const activeEmbedUrl = formatAutoplayUrl(currentStreamUrl);
  const activeSeasonConfig = showConfig.seasons.find((s) => s.season === selectedSeason) || showConfig.seasons[0];

  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Top Bar: Clean dark title bar with Server Selector & Episode Picker */}
      <div className="bg-surface-2/90 px-3 md:px-6 py-3 border-b border-hairline flex flex-wrap items-center justify-between gap-2.5 relative z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-1 border border-hairline flex items-center justify-center text-ink shrink-0">
            <Tv className="w-4 h-4 text-ink" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-sm md:text-lg font-semibold text-ink truncate max-w-[160px] sm:max-w-none">
              {channel.name}
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-semantic-success/15 text-semantic-success border border-semantic-success/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Signal className="w-2.5 h-2.5 animate-pulse" />
              24/7 LIVE
            </span>
            {playingSeason !== null && playingEpisode !== null && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-surface-1 text-ink-muted border border-hairline px-2.5 py-0.5 rounded-full">
                S{playingSeason} E{playingEpisode}
              </span>
            )}
          </div>
        </div>

        {/* Top Controls: Drawer Episode Selector + Server Selector + Next Episode Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Shadcn React Aria / Base UI Drawer Component */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger
              render={
                <button
                  className="inline-flex items-center gap-1.5 bg-surface-1 hover:bg-hairline text-ink text-xs font-medium px-3 py-2 rounded-full border border-hairline transition-all active:scale-95 shadow-sm"
                  title="Open Episode Selection Drawer"
                >
                  <ListVideo className="w-3.5 h-3.5 text-accent-blue" />
                  <span className="hidden sm:inline">Pick Episode</span>
                  <span className="sm:hidden">Episodes</span>
                </button>
              }
            />
            <DrawerContent showSwipeHandle={true}>
              <DrawerHeader>
                <DrawerTitle className="flex items-center justify-between text-base md:text-lg">
                  <span className="flex items-center gap-2">
                    <ListVideo className="w-5 h-5 text-accent-blue" />
                    <span>Episode Selection — {channel.name}</span>
                  </span>
                </DrawerTitle>
                <DrawerDescription>
                  Choose any season and episode below to start playing immediately.
                </DrawerDescription>
              </DrawerHeader>

              <div className="p-4 md:p-6 overflow-y-auto space-y-5 max-h-[60vh]">
                {/* Season Tabs */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Select Season
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {showConfig.seasons.map((s) => (
                      <button
                        key={s.season}
                        onClick={() => setSelectedSeason(s.season)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border ${
                          selectedSeason === s.season
                            ? "bg-ink text-canvas border-ink shadow-md"
                            : "bg-surface-2 text-ink-muted hover:text-ink hover:bg-hairline border-hairline"
                        }`}
                      >
                        Season {s.season} ({s.episodesCount} Ep)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Episode Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                      Season {selectedSeason} Episodes ({activeSeasonConfig?.episodesCount || 0})
                    </span>
                    {playingSeason === selectedSeason && (
                      <span className="text-[11px] font-medium text-semantic-success">
                        Now Playing S{playingSeason} E{playingEpisode}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {Array.from({ length: activeSeasonConfig?.episodesCount || 0 }).map((_, idx) => {
                      const epNum = idx + 1;
                      const isPlaying = playingSeason === selectedSeason && playingEpisode === epNum;
                      return (
                        <button
                          key={epNum}
                          onClick={() => handleSelectSpecificEpisode(selectedSeason, epNum)}
                          className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                            isPlaying
                              ? "bg-accent-blue/20 text-accent-blue border-accent-blue font-bold shadow-sm"
                              : "bg-surface-2 hover:bg-hairline text-ink border-hairline/80 hover:scale-105"
                          }`}
                        >
                          {isPlaying ? (
                            <Play className="w-3.5 h-3.5 fill-current animate-pulse mb-0.5" />
                          ) : (
                            <span className="text-[10px] text-ink-muted font-normal">Ep</span>
                          )}
                          <span>{epNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DrawerFooter className="flex-row justify-between items-center border-t border-hairline/60 pt-3">
                <span className="text-xs text-ink-muted">
                  Total {showConfig.seasons.reduce((a, b) => a + b.episodesCount, 0)} episodes available
                </span>
                <DrawerClose
                  render={
                    <button className="bg-surface-2 hover:bg-hairline text-ink text-xs font-semibold px-4 py-2 rounded-full border border-hairline transition-all">
                      Close
                    </button>
                  }
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Server Selector Dropdown */}
          {servers.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowServerDropdown(!showServerDropdown)}
                className="inline-flex items-center gap-1.5 bg-surface-1 hover:bg-hairline text-ink text-xs font-medium px-3 py-2 rounded-full border border-hairline transition-all"
                title="Select Stream Server"
              >
                <Server className="w-3.5 h-3.5 text-ink-muted" />
                <span className="hidden md:inline">
                  {servers[activeServerIndex]?.name || "Select Server"}
                </span>
                <span className="md:hidden">Server</span>
              </button>

              {showServerDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-1/98 border border-hairline rounded-xl p-1.5 shadow-2xl z-50 backdrop-blur-xl flex flex-col gap-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-ink-muted uppercase tracking-wider border-b border-hairline/60">
                    Available Servers
                  </div>
                  {servers.map((server, idx) => (
                    <button
                      key={server.url + idx}
                      onClick={() => handleSelectServer(idx)}
                      className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg transition-colors ${
                        activeServerIndex === idx
                          ? "bg-surface-2 text-ink font-semibold border border-hairline"
                          : "text-ink-muted hover:text-ink hover:bg-surface-2/40"
                      }`}
                    >
                      <span className="truncate">{server.name}</span>
                      {activeServerIndex === idx && <Check className="w-3.5 h-3.5 text-ink shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={fetchNextRandomEpisode}
            disabled={isLoadingStream}
            className="inline-flex items-center gap-1.5 bg-surface-2 hover:bg-hairline text-ink text-xs font-semibold px-3 py-2 rounded-full border border-hairline transition-all active:scale-95 disabled:opacity-50"
            title="Randomly play another episode"
          >
            <Shuffle className="w-3.5 h-3.5 text-ink-muted" />
            <span className="hidden sm:inline">Next Random</span>
            <span className="sm:hidden">Random</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-ink-muted hover:text-ink bg-surface-2 hover:bg-hairline rounded-full border border-hairline transition-colors"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video View Box */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {isLoadingStream && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 text-ink">
            <Loader2 className="w-8 h-8 text-ink-muted animate-spin" />
            <span className="text-xs font-medium text-ink-muted">Loading stream...</span>
          </div>
        )}

        {activeEmbedUrl ? (
          <iframe
            key={streamKey}
            src={activeEmbedUrl}
            title={`${channel.name} Live Stream`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="text-center p-6 text-xs text-ink-muted">
            <span>Connecting to 24/7 stream...</span>
          </div>
        )}

        {/* Live Watermark Overlay */}
        <div className="absolute top-4 right-4 pointer-events-none bg-black/80 backdrop-blur-md border border-hairline px-3 py-1 rounded-full flex items-center gap-2 shadow-lg z-10">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-bold text-white tracking-widest uppercase">
            24/7 LIVE
          </span>
        </div>
      </div>

      {/* Stream Disclaimer & Ad-Blocker Suggestion Footer */}
      <div className="bg-surface-2/80 px-4 py-2.5 border-t border-hairline flex items-center gap-2.5 text-[11px] text-ink-muted">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="leading-snug">
          Content is streamed from external third-party servers and may contain ads or popups. We suggest using an ad-blocker like{" "}
          <a
            href="https://ublockorigin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 font-semibold underline hover:text-white transition-colors"
          >
            uBlock Origin
          </a>.
        </span>
      </div>
    </div>
  );
}

