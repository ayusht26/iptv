import { NextRequest, NextResponse } from "next/server";
import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { Channel } from "@/lib/iptv/types";

// Helper to normalize strings for search
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const trimmedQuery = q.trim().toLowerCase();

  const { channels } = await fetchIPTVData();

  if (!trimmedQuery) {
    // Empty query: return top featured channels prioritizing DLHD channels
    const topChannels = [...channels]
      .sort((a, b) => (b.hasDlhd ? 1 : 0) - (a.hasDlhd ? 1 : 0))
      .slice(0, 10);

    return NextResponse.json({ results: topChannels });
  }

  const normalizedQuery = normalize(trimmedQuery);

  const matched: Channel[] = [];

  for (let i = 0; i < channels.length; i++) {
    const c = channels[i];

    // Fast check: direct includes or normalized match
    const nameMatch = c.name.toLowerCase().includes(trimmedQuery);
    const altMatch = c.altNames.some((alt) => alt.toLowerCase().includes(trimmedQuery));
    const networkMatch = c.network ? c.network.toLowerCase().includes(trimmedQuery) : false;
    const countryMatch = c.country.toLowerCase().includes(trimmedQuery) || c.countryName.toLowerCase().includes(trimmedQuery);
    const categoryMatch = c.categoryNames.some((cat) => cat.toLowerCase().includes(trimmedQuery));

    if (nameMatch || altMatch || networkMatch || countryMatch || categoryMatch) {
      matched.push(c);
      continue;
    }

    // Secondary search: normalized query match
    if (
      normalize(c.name).includes(normalizedQuery) ||
      c.altNames.some((alt) => normalize(alt).includes(normalizedQuery))
    ) {
      matched.push(c);
    }
  }

  // Sort matched results: DLHD channels FIRST, then logo channels, then rest
  matched.sort((a, b) => {
    if (a.hasDlhd && !b.hasDlhd) return -1;
    if (!a.hasDlhd && b.hasDlhd) return 1;
    if (a.logo && !b.logo) return -1;
    if (!a.logo && b.logo) return 1;
    return 0;
  });

  return NextResponse.json({ results: matched.slice(0, 15) });
}
