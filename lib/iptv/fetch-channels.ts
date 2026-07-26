import { Channel, Category, Country, Language } from "./types";
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

type ApiLanguage = {
  code: string;
  name: string;
};

type ProcessedData = {
  channels: Channel[];
  categories: Category[];
  countries: Country[];
  languages: Language[];
};

// Module-level in-memory cache to deduplicate requests across components
let cachedData: { data: ProcessedData; timestamp: number } | null = null;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

export const fetchIPTVData = cache(async (): Promise<ProcessedData> => {
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
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
      languagesRes,
    ] = await Promise.all([
      fetch(`${API_BASE}/channels.json`, fetchOpts),
      fetch(`${API_BASE}/streams.json`, fetchOpts),
      fetch(`${API_BASE}/logos.json`, fetchOpts),
      fetch(`${API_BASE}/categories.json`, fetchOpts),
      fetch(`${API_BASE}/countries.json`, fetchOpts),
      fetch(`${API_BASE}/languages.json`, fetchOpts),
    ]);

    const [
      apiChannels,
      apiStreams,
      apiLogos,
      apiCategories,
      apiCountries,
      apiLanguages,
    ]: [
      ApiChannel[],
      ApiStream[],
      ApiLogo[],
      ApiCategory[],
      ApiCountry[],
      ApiLanguage[]
    ] = await Promise.all([
      channelsRes.json(),
      streamsRes.json(),
      logosRes.json(),
      categoriesRes.json(),
      countriesRes.json(),
      languagesRes.json(),
    ]);

    // Build Maps for fast O(1) lookups
    const categoryMap = new Map<string, string>();
    apiCategories.forEach((cat) => {
      if (cat.id && cat.name) categoryMap.set(cat.id, cat.name);
    });

    const countryMap = new Map<string, string>();
    apiCountries.forEach((cou) => {
      if (cou.code && cou.name) countryMap.set(cou.code, cou.name);
    });

    const streamMap = new Map<string, { url: string; quality: string | null }>();
    apiStreams.forEach((st) => {
      if (st.channel && st.url && !streamMap.has(st.channel)) {
        streamMap.set(st.channel, {
          url: st.url,
          quality: st.quality || null,
        });
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
      if (ch.closed || ch.is_nsfw) return;

      const streamInfo = streamMap.get(ch.id);
      if (!streamInfo || !streamInfo.url) return;

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
        streamUrl: streamInfo.url,
        quality: streamInfo.quality,
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

    const languages = apiLanguages
      .map((l) => ({ code: l.code, name: l.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const result: ProcessedData = {
      channels,
      categories,
      countries,
      languages,
    };

    cachedData = { data: result, timestamp: now };
    return result;
  } catch (error) {
    console.error("Error fetching IPTV data:", error);
    if (cachedData) return cachedData.data;

    return {
      channels: [],
      categories: [],
      countries: [],
      languages: [],
    };
  }
});
