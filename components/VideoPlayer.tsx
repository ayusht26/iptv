"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
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
  Volume1,
} from "lucide-react";
import Link from "next/link";

interface VideoPlayerProps {
  src: string;
  streamUrls?: string[];
  channelName: string;
  autoPlay?: boolean;
}

export function VideoPlayer({
  src,
  streamUrls = [],
  channelName,
  autoPlay = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // List of fallback stream URLs
  const allStreams = useMemo(
    () => (streamUrls.length > 0 ? streamUrls : [src]),
    [src, streamUrls]
  );

  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted at 100% volume
  const [volume, setVolume] = useState(1.0); // 100% volume
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showControls, setShowControls] = useState(true);
  const [needUserUnmute, setNeedUserUnmute] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeStreamUrl = allStreams[currentStreamIndex] || src;

  // Safe play helper to handle promise rejections cleanly
  const safePlay = useCallback(async (video: HTMLVideoElement) => {
    try {
      video.muted = false;
      video.volume = 1.0;
      await video.play();
      setIsPlaying(true);
      setIsMuted(false);
      setNeedUserUnmute(false);
    } catch (err: unknown) {
      const errorName = (err as Error)?.name;
      if (errorName === "NotAllowedError") {
        // Autoplay with sound blocked due to browser audio policy
        video.muted = true;
        setIsMuted(true);
        setNeedUserUnmute(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch (retryErr) {
          console.warn("Muted autoplay also blocked:", retryErr);
          setIsPlaying(false);
        }
      } else if (errorName === "AbortError") {
        // Interrupted by new load - ignore
      } else {
        console.warn("Play error:", err);
        setIsPlaying(false);
      }
    }
  }, []);

  // Main playback setup effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeStreamUrl) return;

    let hls: Hls | null = null;
    let isCancelled = false;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    video.volume = 1.0;
    video.muted = false;

    // Check Safari / Native HLS Support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeStreamUrl;
      if (autoPlay) {
        safePlay(video);
      }
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 1, // Start playback immediately from live edge without buffer lag
        initialLiveManifestSize: 1,
        maxBufferLength: 15,
        maxMaxBufferLength: 30,
        backBufferLength: 30,
        manifestLoadingTimeOut: 10000,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOut: 10000,
      });

      hls.loadSource(activeStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isCancelled) return;
        setIsLoading(false);
        if (autoPlay && videoRef.current) {
          safePlay(videoRef.current);
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (isCancelled) return;
        console.warn("HLS stream error:", data.type, data.details);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
            case Hls.ErrorTypes.MEDIA_ERROR:
              // Try next fallback stream URL if available
              if (currentStreamIndex < allStreams.length - 1) {
                console.log(`Stream #${currentStreamIndex + 1} failed. Trying fallback stream...`);
                setCurrentStreamIndex((prev) => prev + 1);
              } else {
                setHasError(true);
                setIsLoading(false);
                setErrorMessage("Broadcast stream is currently offline or unreachable.");
                hls?.destroy();
              }
              break;
            default:
              setHasError(true);
              setIsLoading(false);
              setErrorMessage("Unable to initialize video decoder.");
              hls?.destroy();
              break;
          }
        }
      });
    } else {
      setHasError(true);
      setIsLoading(false);
      setErrorMessage("HLS playback is not supported in this browser.");
    }

    return () => {
      isCancelled = true;
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [activeStreamUrl, autoPlay, currentStreamIndex, allStreams.length, safePlay]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      safePlay(video);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [safePlay]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    setNeedUserUnmute(false);
    if (nextMuted) {
      setVolume(0);
    } else {
      setVolume(1.0);
      video.volume = 1.0;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.volume = newVol;
      setVolume(newVol);
      const muted = newVol === 0;
      video.muted = muted;
      setIsMuted(muted);
      setNeedUserUnmute(false);
    }
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  const adjustVolume = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    setVolume((prevVol) => {
      let nextVol = Math.round((prevVol + delta) * 10) / 10;
      nextVol = Math.max(0, Math.min(1, nextVol));

      video.volume = nextVol;
      if (nextVol === 0) {
        video.muted = true;
        setIsMuted(true);
      } else {
        video.muted = false;
        setIsMuted(false);
      }
      setNeedUserUnmute(false);
      return nextVol;
    });

    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false);
      }
    }, 2500);
  }, []);

  // Standard Keyboard Shortcuts: Space (Play/Pause), F (Fullscreen), ArrowUp/ArrowDown (Volume)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        adjustVolume(0.1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        adjustVolume(-0.1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay, toggleFullscreen, adjustVolume]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const handleRetryNextStream = () => {
    setHasError(false);
    setIsLoading(true);
    if (currentStreamIndex < allStreams.length - 1) {
      setCurrentStreamIndex((prev) => prev + 1);
    } else {
      setCurrentStreamIndex(0);
    }
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
          if (currentStreamIndex < allStreams.length - 1) {
            setCurrentStreamIndex((prev) => prev + 1);
          } else {
            setHasError(true);
            setIsLoading(false);
            setErrorMessage("Failed to load stream payload.");
          }
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Unmute Prompt Overlay */}
      {needUserUnmute && isPlaying && (
        <button
          onClick={toggleMute}
          className="absolute top-4 left-4 z-40 bg-accent-blue/90 hover:bg-accent-blue text-white text-xs font-semibold px-3.5 py-2 rounded-pill flex items-center gap-2 shadow-lg backdrop-blur-md transition-all active:scale-95 animate-bounce"
        >
          <Volume1 className="w-4 h-4" />
          <span>Click to Unmute Audio</span>
        </button>
      )}

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-surface-1/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-ink z-20">
          <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium">Connecting to stream...</p>
            <p className="text-xs text-ink-muted mt-1">
              {channelName} {allStreams.length > 1 ? `(Feed ${currentStreamIndex + 1}/${allStreams.length})` : ""}
            </p>
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
            <h4 className="text-base font-semibold text-ink">Stream Offline</h4>
            <p className="text-xs text-ink-muted">
              {errorMessage || "The broadcast provider is unreachable."}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleRetryNextStream}
              className="inline-flex items-center gap-2 bg-surface-2 hover:bg-hairline text-ink text-xs font-medium px-4 py-2 rounded-pill border border-hairline transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry stream</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black text-xs font-semibold px-4 py-2 rounded-pill transition-colors shadow-sm"
            >
              <Tv className="w-3.5 h-3.5 text-black" />
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
          <div className="flex items-center justify-between text-xs text-white/90 px-1">
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
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-white ml-0.5" />
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
                    <Volume2 className="w-4 h-4 text-white" />
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
              <Maximize className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
