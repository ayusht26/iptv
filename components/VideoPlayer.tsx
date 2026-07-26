"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  AlertCircle,
  Loader2,
  RefreshCw,
  Tv,
} from "lucide-react";
import Link from "next/link";

interface VideoPlayerProps {
  src: string;
  channelName: string;
  autoPlay?: boolean;
}

export function VideoPlayer({
  src,
  channelName,
  autoPlay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    // Check if browser natively supports HLS (e.g. Safari)
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (autoPlay) {
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Autoplay prevented:", err);
            setIsPlaying(false);
          });
      }
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (autoPlay) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn("Autoplay blocked:", err);
              setIsPlaying(false);
            });
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("HLS Error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage("Unable to connect to stream host.");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              setHasError(true);
              setErrorMessage(
                "This stream is currently offline or unavailable."
              );
              hls?.destroy();
              break;
          }
        }
      });
    } else {
      setHasError(true);
      setErrorMessage("HLS playback is not supported in this browser.");
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVol;
      setVolume(newVol);
      setIsMuted(newVol === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-hairline group shadow-2xl flex items-center justify-center select-none"
    >
      {/* Native Video Element */}
      <video
        ref={videoRef}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
          setErrorMessage("Failed to load stream payload.");
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-ink z-20">
          <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium">Connecting to stream...</p>
            <p className="text-xs text-ink-muted mt-1">{channelName}</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-surface-1/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-ink z-30 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="max-w-md space-y-1">
            <h4 className="text-base font-semibold">Stream Offline</h4>
            <p className="text-xs text-ink-muted">
              {errorMessage || "The broadcast provider is unreachable."}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="inline-flex items-center gap-2 bg-surface-2 hover:bg-hairline text-ink text-xs font-medium px-4 py-2 rounded-pill border border-hairline transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry stream</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-ink hover:bg-ink/90 text-on-primary text-xs font-medium px-4 py-2 rounded-pill transition-colors"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Try another channel</span>
            </Link>
          </div>
        </div>
      )}

      {/* Custom Player Controls Bar */}
      {!hasError && (
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col gap-2 transition-opacity duration-300 z-10 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Top Line of Controls: Channel Title */}
          <div className="flex items-center justify-between text-xs text-white/80 px-1">
            <span className="font-medium truncate max-w-xs md:max-w-md">
              {channelName}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] bg-red-500/20 border border-red-500/30 text-red-300 px-2 py-0.5 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              LIVE
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Mute & Volume */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                  className="p-1 text-white/80 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 md:w-24 accent-accent-blue cursor-pointer h-1 bg-white/20 rounded-full"
                  aria-label="Volume slider"
                />
              </div>
            </div>

            {/* Right: Fullscreen */}
            <button
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
