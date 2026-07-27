import React from "react";
import { ChannelCardSkeleton } from "@/components/ChannelCardSkeleton";

export default function RootLoading() {
  return (
    <div className="w-full space-y-8 py-4 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="bg-surface-1 border border-hairline rounded-3xl p-6 md:p-12 space-y-4 text-center max-w-4xl mx-auto">
        <div className="h-6 w-48 bg-surface-2 rounded-full mx-auto" />
        <div className="h-10 w-3/4 bg-surface-2 rounded-xl mx-auto" />
        <div className="h-4 w-1/2 bg-surface-2 rounded-lg mx-auto" />
        <div className="flex justify-center gap-3 pt-2">
          <div className="h-10 w-32 bg-surface-2 rounded-full" />
          <div className="h-10 w-32 bg-surface-2 rounded-full" />
        </div>
      </div>

      {/* Grid Filter Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <div className="h-10 w-72 bg-surface-2 rounded-xl" />
        <div className="h-10 w-48 bg-surface-2 rounded-xl" />
      </div>

      {/* Channels Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
