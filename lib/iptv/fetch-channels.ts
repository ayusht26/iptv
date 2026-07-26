import { Channel, Category, Country } from "./types";
import { cache } from "react";

const API_BASE = "https://iptv-org.github.io/api";

type ApiChannel = {
  id: string;
  name: string;
  alt_names?: string[];
  network?: string | null;
  owners?: string[];
  country?: string;
  subdivision?: string | null;
  city?: string | null;
  categories?: string[];
  is_nsfw?: boolean;
  launched?: string | null;
  closed?: string | null;
  replaced_by?: string | null;
  website?: string | null;
};

type ApiStream = {
  channel?: string | null;
  feed?: string | null;
  title?: string | null;
  url?: string | null;
  quality?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
};

type ApiLogo = {
  channel?: string | null;
  feed?: string | null;
  in_use?: boolean;
  url?: string | null;
  width?: number;
  height?: number;
  format?: string;
};

type ApiCategory = {
  id: string;
  name: string;
};

type ApiCountry = {
  code: string;
  name: string;
};

type ProcessedData = {
  channels: Channel[];
  categories: Category[];
  countries: Country[];
};

// Module-level in-memory cache
let cachedData: { data: ProcessedData; timestamp: number } | null = null;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const fetchIPTVData = cache(async (): Promise<ProcessedData> => {
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    console.log("⚡ IPTV data served from in-memory cache");
    return cachedData.data;
  }

  try {
    const fetchOpts: RequestInit = { next: { revalidate: 21600 } };

    const [
      channelsRes,
      streamsRes,
      logosRes,
      categoriesRes,
      countriesRes,
      blocklistRes,
    ] = await Promise.all([
      fetch(`${API_BASE}/channels.json`, fetchOpts),
      fetch(`${API_BASE}/streams.json`, fetchOpts),
      fetch(`${API_BASE}/logos.json`, fetchOpts),
      fetch(`${API_BASE}/categories.json`, fetchOpts),
      fetch(`${API_BASE}/countries.json`, fetchOpts),
      fetch(`${API_BASE}/blocklist.json`, fetchOpts).catch(() => null),
    ]);

    const apiChannels: ApiChannel[] = await channelsRes.json();
    const apiStreams: ApiStream[] = await streamsRes.json();
    const apiLogos: ApiLogo[] = await logosRes.json();
    const apiCategories: ApiCategory[] = await categoriesRes.json();
    const apiCountries: ApiCountry[] = await countriesRes.json();
    
    let apiBlocklist: { channel: string }[] = [];
    if (blocklistRes && blocklistRes.ok) {
      try {
        apiBlocklist = await blocklistRes.json();
      } catch {
        apiBlocklist = [];
      }
    }

    const blocklistSet = new Set<string>();
    apiBlocklist.forEach((b) => {
      if (b.channel) blocklistSet.add(b.channel);
    });

    // Build Maps for fast O(1) lookups
    const categoryMap = new Map<string, string>();
    apiCategories.forEach((cat) => {
      if (cat.id && cat.name) categoryMap.set(cat.id, cat.name);
    });

    const countryMap = new Map<string, string>();
    apiCountries.forEach((cou) => {
      if (cou.code && cou.name) countryMap.set(cou.code, cou.name);
    });

    // Map channelId to ALL stream URLs (fallback list for maximum stream playback reliability)
    const streamMap = new Map<string, { urls: string[]; quality: string | null }>();
    apiStreams.forEach((st) => {
      if (st.channel && st.url) {
        const existing = streamMap.get(st.channel);
        if (existing) {
          if (!existing.urls.includes(st.url)) {
            existing.urls.push(st.url);
          }
          if (!existing.quality && st.quality) {
            existing.quality = st.quality;
          }
        } else {
          streamMap.set(st.channel, {
            urls: [st.url],
            quality: st.quality || null,
          });
        }
      }
    });

    const logoMap = new Map<string, string>();
    apiLogos.forEach((lg) => {
      if (lg.channel && lg.url) {
        if (!logoMap.has(lg.channel) || lg.in_use) {
          logoMap.set(lg.channel, lg.url);
        }
      }
    });

    // Process and filter channels
    const channels: Channel[] = [];

    apiChannels.forEach((ch) => {
      if (ch.closed || ch.is_nsfw || blocklistSet.has(ch.id)) return;

      const streamInfo = streamMap.get(ch.id);

      const categories = ch.categories || [];
      const categoryNames = categories
        .map((catId) => categoryMap.get(catId) || catId)
        .filter(Boolean);

      const country = ch.country || "UNKNOWN";
      const countryName = countryMap.get(country) || country;

      channels.push({
        id: ch.id,
        name: ch.name || ch.id,
        altNames: ch.alt_names || [],
        network: ch.network || null,
        country,
        countryName,
        categories,
        categoryNames,
        logo: logoMap.get(ch.id) || null,
        streamUrl: streamInfo?.urls[0] || null,
        streamUrls: streamInfo?.urls || [],
        quality: streamInfo?.quality || null,
        website: ch.website || null,
      });
    });

    // Used categories and countries
    const usedCategoryIds = new Set<string>();
    const usedCountryCodes = new Set<string>();

    channels.forEach((c) => {
      c.categories.forEach((cat) => usedCategoryIds.add(cat));
      if (c.country) usedCountryCodes.add(c.country);
    });

    const categories = apiCategories
      .filter((c) => usedCategoryIds.has(c.id))
      .map((c) => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const countries = apiCountries
      .filter((c) => usedCountryCodes.has(c.code))
      .map((c) => ({ code: c.code, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const result: ProcessedData = {
      channels,
      categories,
      countries,
    };

    cachedData = { data: result, timestamp: now };
    console.log("🌐 IPTV data successfully fetched & cached into memory");
    return result;
  } catch (error) {
    console.error("Error fetching IPTV data:", error);
    if (cachedData) return cachedData.data;

    return {
      channels: [],
      categories: [],
      countries: [],
    };
  }
});
