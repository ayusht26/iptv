import { Channel, Category, Country, StreamServer } from "./types";
import { cache } from "react";
import { fetchDLHDChannels } from "./dlhd-data";
import { getLogoForDLHDChannel } from "./logo-mapper";

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

// Helper to normalize channel names for smart deduplication
function normalizeChannelKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(hd|sd|fhd|uhd|4k|usa|us|uk|ca|au|channel|tv|network|stream|live)\b/gi, "")
    .replace(/[^a-z0-9]/gi, "")
    .trim();
}

export const fetchIPTVData = cache(async (): Promise<ProcessedData> => {
  const now = Date.now();
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    console.log("⚡ IPTV & DLHD data served from in-memory cache");
    return cachedData.data;
  }

  try {
    const fetchOpts: RequestInit = { next: { revalidate: 21600 } };

    // Fetch IPTV-org data and DLHD channels in parallel
    const [
      channelsRes,
      streamsRes,
      logosRes,
      categoriesRes,
      countriesRes,
      blocklistRes,
      dlhdChannels,
    ] = await Promise.all([
      fetch(`${API_BASE}/channels.json`, fetchOpts),
      fetch(`${API_BASE}/streams.json`, fetchOpts),
      fetch(`${API_BASE}/logos.json`, fetchOpts),
      fetch(`${API_BASE}/categories.json`, fetchOpts),
      fetch(`${API_BASE}/countries.json`, fetchOpts),
      fetch(`${API_BASE}/blocklist.json`, fetchOpts).catch(() => null),
      fetchDLHDChannels().catch(() => [] as Channel[]),
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

    // Build Maps for fast lookups
    const categoryMap = new Map<string, string>();
    apiCategories.forEach((cat) => {
      if (cat.id && cat.name) categoryMap.set(cat.id, cat.name);
    });

    const countryMap = new Map<string, string>();
    apiCountries.forEach((cou) => {
      if (cou.code && cou.name) countryMap.set(cou.code, cou.name);
    });

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

    // Process IPTV-org channels
    const iptvChannels: Channel[] = [];
    const iptvChannelKeyMap = new Map<string, Channel>();

    apiChannels.forEach((ch) => {
      if (ch.closed || ch.is_nsfw || blocklistSet.has(ch.id)) return;

      const streamInfo = streamMap.get(ch.id);
      const categories = ch.categories || [];
      const categoryNames = categories
        .map((catId) => categoryMap.get(catId) || catId)
        .filter(Boolean);

      const country = ch.country || "UNKNOWN";
      const countryName = countryMap.get(country) || country;
      const iptvLogo = logoMap.get(ch.id) || null;

      const hlsServers: StreamServer[] = (streamInfo?.urls || []).map((url, idx) => ({
        id: `iptv-${ch.id}-${idx}`,
        name: idx === 0 ? "IPTV HLS Primary" : `IPTV HLS Feed ${idx + 1}`,
        url,
        type: "hls",
        source: "iptv-org",
      }));

      const channelObj: Channel = {
        id: ch.id,
        name: ch.name || ch.id,
        altNames: ch.alt_names || [],
        network: ch.network || null,
        country,
        countryName,
        categories,
        categoryNames,
        logo: iptvLogo,
        streamUrl: streamInfo?.urls[0] || null,
        streamUrls: streamInfo?.urls || [],
        servers: hlsServers,
        defaultServerId: hlsServers[0]?.id,
        quality: streamInfo?.quality || null,
        website: ch.website || null,
        hasDlhd: false,
        hasIptvOrg: true,
      };

      iptvChannels.push(channelObj);
      const normKey = normalizeChannelKey(channelObj.name);
      if (normKey && !iptvChannelKeyMap.has(normKey)) {
        iptvChannelKeyMap.set(normKey, channelObj);
      }
    });

    // Merge DLHD channels into IPTV channels with DLHD priority
    const finalChannelsMap = new Map<string, Channel>();

    // First add all IPTV channels
    iptvChannels.forEach((ch) => {
      finalChannelsMap.set(ch.id, ch);
    });

    // Process DLHD channels
    dlhdChannels.forEach((dlhdCh) => {
      const normKey = normalizeChannelKey(dlhdCh.name);
      const matchedIptvChannel = normKey ? iptvChannelKeyMap.get(normKey) : null;

      if (matchedIptvChannel) {
        // Channel exists in BOTH IPTV-org and DLHD!
        // Merge DLHD servers with IPTV servers, giving DLHD top priority.
        const combinedServers = [...dlhdCh.servers, ...matchedIptvChannel.servers];
        const combinedCategories = Array.from(
          new Set([...dlhdCh.categories, ...matchedIptvChannel.categories])
        );
        const combinedCategoryNames = Array.from(
          new Set([...dlhdCh.categoryNames, ...matchedIptvChannel.categoryNames])
        );

        const mergedChannel: Channel = {
          ...matchedIptvChannel,
          // Give DLHD priority by placing DLHD server first as default
          streamUrl: dlhdCh.servers[0].url,
          servers: combinedServers,
          defaultServerId: dlhdCh.servers[0].id,
          hasDlhd: true,
          hasIptvOrg: true,
          logo:
            matchedIptvChannel.logo ||
            getLogoForDLHDChannel(dlhdCh.name, dlhdCh.logo, logoMap) ||
            dlhdCh.logo,
          categories: combinedCategories,
          categoryNames: combinedCategoryNames,
        };

        finalChannelsMap.set(matchedIptvChannel.id, mergedChannel);
      } else {
        // DLHD unique channel
        const resolvedLogo =
          getLogoForDLHDChannel(dlhdCh.name, dlhdCh.logo, logoMap) || dlhdCh.logo;

        finalChannelsMap.set(dlhdCh.id, {
          ...dlhdCh,
          logo: resolvedLogo,
        });
      }
    });

    const mergedChannelsList = Array.from(finalChannelsMap.values());

    // Used categories and countries calculation
    const usedCategoryIds = new Set<string>();
    const usedCountryCodes = new Set<string>();

    mergedChannelsList.forEach((c) => {
      c.categories.forEach((cat) => usedCategoryIds.add(cat));
      if (c.country) usedCountryCodes.add(c.country);
    });

    // Make sure Sports category is included
    usedCategoryIds.add("sports");

    const categories = apiCategories
      .concat([{ id: "sports", name: "Sports" }])
      .filter((c, idx, arr) => arr.findIndex((x) => x.id === c.id) === idx)
      .filter((c) => usedCategoryIds.has(c.id))
      .map((c) => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const countries = apiCountries
      .filter((c) => usedCountryCodes.has(c.code))
      .map((c) => ({ code: c.code, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const result: ProcessedData = {
      channels: mergedChannelsList,
      categories,
      countries,
    };

    cachedData = { data: result, timestamp: now };
    console.log(`🌐 Total ${mergedChannelsList.length} unified channels cached`);
    return result;
  } catch (error) {
    console.error("Error fetching IPTV & DLHD data:", error);
    if (cachedData) return cachedData.data;

    return {
      channels: [],
      categories: [],
      countries: [],
    };
  }
});
