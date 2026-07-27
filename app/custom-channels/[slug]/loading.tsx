import React from "react";

export default function CustomChannelDetailLoading() {
  return (
    <div className="space-y-6 md:space-y-8 py-4 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 bg-surface-2 rounded-lg" />

      {/* Header Hero Skeleton */}
      <div className="bg-surface-1 border border-hairline rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-surface-2 shrink-0" />
          <div className="space-y-2">
            <div className="h-7 w-64 bg-surface-2 rounded-xl" />
            <div className="h-4 w-80 bg-surface-2 rounded-lg" />
          </div>
        </div>
        <div className="h-8 w-24 bg-surface-2 rounded-full shrink-0" />
      </div>

      {/* Video Player Skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-40 bg-surface-2 rounded-md" />
        <div className="w-full aspect-video bg-surface-1 border border-hairline rounded-2xl flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-2 animate-ping opacity-25" />
        </div>
      </div>

      {/* Related Channels Skeleton */}
      <div className="space-y-4 pt-6 border-t border-hairline-soft">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-6 w-48 bg-surface-2 rounded-lg" />
            <div className="h-3 w-64 bg-surface-2 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-surface-2 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-1 border border-hairline rounded-2xl p-5 space-y-4 h-44"
            >
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-surface-2 rounded-full" />
                <div className="h-4 w-16 bg-surface-2 rounded-full" />
              </div>
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-2 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-surface-2 rounded" />
                  <div className="h-3 w-full bg-surface-2 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
