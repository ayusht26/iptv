"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, ExternalLink, X, Wifi, Download } from "lucide-react";

export function VPNNoticeBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem("vpn_notice_dismissed");
    if (isDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("vpn_notice_dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <div className="w-full bg-surface-1 border border-hairline rounded-xl p-4 md:p-5 shadow-xl transition-all relative overflow-hidden group">
      {/* Soft atmospheric gradient wash matching Framer design language */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        {/* Left Side: Icon & Disclaimer Text */}
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-ink tracking-tight">
                Stream Buffering or Offline in Your Region?
              </h4>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-surface-2 text-accent-blue border border-hairline rounded-full font-mono">
                ISP Notice
              </span>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              If the stream fails to connect, buffers endlessly, or shows server errors, your ISP may be blocking live video feeds. Use a free service like <strong className="text-ink font-medium">Cloudflare WARP (1.1.1.1)</strong> or any free VPN to restore instant playback.
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons & Dismiss */}
        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <a
            href="https://1.1.1.1/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-semibold px-4 py-2 rounded-pill transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Get Cloudflare WARP</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            onClick={handleDismiss}
            title="Dismiss notice"
            className="p-2 rounded-full text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
