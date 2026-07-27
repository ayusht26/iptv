"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { CustomChannel } from "@/lib/iptv/types";
import { Signal, Shuffle, Tv, X, Loader2 } from "lucide-react";

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
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(true);
  const [streamKey, setStreamKey] = useState<number>(0);
  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch a random stream for the active channel (supports Doraemon, Pokemon, Shinchan, Ben 10, Naruto, Spider-Man)
  const fetchNextRandomEpisode = useCallback(async () => {
    setIsLoadingStream(true);
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }

    try {
      const res = await fetch(`/api/doraemon-stream?show=${channel.id}`, { cache: "no-store" });
      const data = await res.json();
      if (data && data.streamUrl) {
        setCurrentStreamUrl(data.streamUrl);
        setStreamKey((prev) => prev + 1);
      } else {
        setCurrentStreamUrl("https://bysezejataos.com/e/1zrtewhd4lmg/");
      }
    } catch (err) {
      console.error("Error fetching random stream:", err);
      setCurrentStreamUrl("https://bysezejataos.com/e/1zrtewhd4lmg/");
    } finally {
      setIsLoadingStream(false);
    }
  }, [channel.id]);

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

  const activeEmbedUrl = formatAutoplayUrl(currentStreamUrl);

  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Top Bar: Clean dark title bar */}
      <div className="bg-surface-2/90 px-4 md:px-6 py-3 border-b border-hairline flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-1 border border-hairline flex items-center justify-center text-ink shrink-0">
            <Tv className="w-4 h-4 text-ink" />
          </div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-base md:text-lg font-semibold text-ink">
              {channel.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-semantic-success/15 text-semantic-success border border-semantic-success/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Signal className="w-2.5 h-2.5 animate-pulse" />
              24/7 LIVE
            </span>
          </div>
        </div>

        {/* Top Control Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchNextRandomEpisode}
            disabled={isLoadingStream}
            className="inline-flex items-center gap-1.5 bg-surface-2 hover:bg-hairline text-ink text-xs font-semibold px-3.5 py-2 rounded-full border border-hairline transition-all active:scale-95 disabled:opacity-50"
            title="Randomly play another episode"
          >
            <Shuffle className="w-3.5 h-3.5 text-ink-muted" />
            <span>Next Random Episode</span>
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
            <span className="text-xs font-medium text-ink-muted">Loading next random episode...</span>
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
    </div>
  );
}
