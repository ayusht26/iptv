"use client";

import React, { useState } from "react";
import { Channel, StreamServer } from "@/lib/iptv/types";
import { VideoPlayer } from "./VideoPlayer";
import { Server, Signal, Tv, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";

interface ChannelStreamPlayerProps {
  channel: Channel;
  autoPlay?: boolean;
}

export function ChannelStreamPlayer({
  channel,
  autoPlay = true,
}: ChannelStreamPlayerProps) {
  // Available servers array
  const servers = channel.servers && channel.servers.length > 0
    ? channel.servers
    : channel.streamUrl
    ? [
        {
          id: "default-hls",
          name: "Default Stream",
          url: channel.streamUrl,
          type: "hls" as const,
          source: "iptv-org" as const,
          isPrimary: true,
        },
      ]
    : [];

  const [activeServerId, setActiveServerId] = useState<string>(
    channel.defaultServerId || servers[0]?.id || ""
  );

  const activeServer: StreamServer | undefined =
    servers.find((s) => s.id === activeServerId) || servers[0];

  const handleServerChange = (serverId: string) => {
    setActiveServerId(serverId);
  };

  if (!activeServer) {
    return (
      <div className="w-full aspect-video bg-surface-2 rounded-xl border border-hairline p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
        <div className="w-12 h-12 rounded-full bg-surface-1 border border-hairline flex items-center justify-center text-ink-muted">
          <AlertCircle className="w-6 h-6 text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-ink">No Active Stream Server</h3>
        <p className="text-xs text-ink-muted max-w-sm">
          No playback servers are currently listed for {channel.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Server Selection Header Bar */}
      {servers.length > 1 && (
        <div className="bg-surface-1 border border-hairline rounded-xl p-3 shadow-md space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs text-ink font-semibold">
              <Server className="w-4 h-4 text-accent-blue" />
              <span>Select Stream Server / Feed</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ink-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-semantic-success" />
              <span>Clean Embed (No Ads & No Chat)</span>
            </div>
          </div>

          {/* Server Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {servers.map((server) => {
              const isSelected = server.id === activeServer.id;
              const isDlhd = server.source === "dlhd";

              return (
                <button
                  key={server.id}
                  onClick={() => handleServerChange(server.id)}
                  className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-pill transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-black shadow-lg scale-105"
                      : "bg-surface-2 hover:bg-hairline text-ink-muted hover:text-ink border border-hairline"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected
                        ? "bg-semantic-success animate-pulse"
                        : "bg-ink-muted/40"
                    }`}
                  />
                  <span>{server.name}</span>
                  {isDlhd && (
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                        isSelected
                          ? "bg-black/10 text-black"
                          : "bg-canvas text-accent-blue border border-hairline"
                      }`}
                    >
                      DLHD
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Video Screen Container */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-hairline shadow-2xl">
        {activeServer.type === "iframe" ? (
          /* Clean DLHD Embedded Stream Player */
          <div className="w-full h-full relative bg-black">
            <iframe
              src={activeServer.url}
              title={`${channel.name} - ${activeServer.name}`}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              loading="lazy"
            />
          </div>
        ) : (
          /* Native HLS Stream Player */
          <VideoPlayer
            src={activeServer.url}
            channelName={channel.name}
            autoPlay={autoPlay}
          />
        )}
      </div>

      {/* Active Server Info Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5 text-semantic-success animate-pulse" />
          <span>
            Connected to <strong className="text-ink font-medium">{activeServer.name}</strong>
          </span>
        </div>

        {servers.length > 1 && (
          <div className="flex items-center gap-1.5 text-ink-muted/80">
            <RefreshCw className="w-3 h-3 text-accent-blue" />
            <span>Buffering or offline? Select another server above.</span>
          </div>
        )}
      </div>
    </div>
  );
}
