import { ChannelCardSkeleton } from "@/components/ChannelCardSkeleton";

export default function CustomChannelsLoading() {
  return (
    <div className="w-full space-y-8 py-4 animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-surface-1 border border-hairline rounded-3xl p-8 md:p-12 space-y-4 max-w-5xl mx-auto text-center shadow-md">
        <div className="h-6 w-48 bg-surface-2 rounded-pill mx-auto" />
        <div className="h-10 w-3/4 bg-surface-2 rounded-xl mx-auto" />
        <div className="h-4 w-1/2 bg-surface-2 rounded-lg mx-auto" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <ChannelCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
