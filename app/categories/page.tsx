import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { ChannelBrowseGrid } from "@/components/ChannelBrowseGrid";
import type { Metadata } from "next";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Browse Channels — IPTV Only",
  description:
    "Explore thousands of publicly available live TV channels by category, country, and network.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    country?: string;
  }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const { channels, categories, countries } = await fetchIPTVData();
  const resolvedParams = await searchParams;

  const category = resolvedParams?.category || "";
  const country = resolvedParams?.country || "";

  return (
    <div className="py-4 space-y-6">
      <div className="space-y-2">
        <h1 className="display-lg text-ink font-semibold tracking-tight">
          Browse Live Channels
        </h1>
        <p className="text-sm text-ink-muted">
          Filter thousands of live public TV streams by category, country, or keyword.
        </p>
      </div>

      <ChannelBrowseGrid
        channels={channels}
        categories={categories}
        countries={countries}
        initialCategory={category}
        initialCountry={country}
      />
    </div>
  );
}
