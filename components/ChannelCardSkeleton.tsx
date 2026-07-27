import React from "react";

export function ChannelCardSkeleton() {
  return (
    <div className="bg-surface-1 border border-hairline rounded-lg p-3.5 flex flex-col justify-between h-[154px] relative overflow-hidden">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Logo Skeleton */}
          <div className="w-12 h-12 bg-surface-2 rounded-lg shrink-0" />
          {/* Country Badge Skeleton */}
          <div className="w-10 h-5 bg-surface-2 rounded-xs shrink-0" />
        </div>

        {/* Title Skeleton */}
        <div className="h-4 bg-surface-2 rounded w-3/4 mb-2" />
        {/* Category Skeleton */}
        <div className="h-3 bg-surface-2/60 rounded w-1/2" />
      </div>

      {/* Footer Skeleton */}
      <div className="pt-3 border-t border-hairline-soft flex items-center justify-between">
        <div className="h-3 bg-surface-2/60 rounded w-16" />
        <div className="w-6 h-6 rounded-full bg-surface-2" />
      </div>
    </div>
  );
}
