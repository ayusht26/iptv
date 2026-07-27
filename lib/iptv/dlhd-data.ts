import { Channel, StreamServer } from "./types";
import { getLogoForDLHDChannel } from "./logo-mapper";

export interface DLHDRawChannel {
  id: string;
  name: string;
  logoUrl?: string | null;
}

// Categories helper
function detectCategories(name: string): { categories: string[]; categoryNames: string[] } {
  const norm = name.toLowerCase();
  const catIds = new Set<string>();
  const catNames = new Set<string>();

  if (
    norm.includes("sport") ||
    norm.includes("espn") ||
    norm.includes("sky sports") ||
    norm.includes("tnt sports") ||
    norm.includes("arena sport") ||
    norm.includes("astro supersport") ||
    norm.includes("bein") ||
    norm.includes("supersport") ||
    norm.includes("fox sports") ||
    norm.includes("nba") ||
    norm.includes("nfl") ||
    norm.includes("mlb") ||
    norm.includes("nhl") ||
    norm.includes("tennis") ||
    norm.includes("golf") ||
    norm.includes("fight") ||
    norm.includes("wwe") ||
    norm.includes("ufc") ||
    norm.includes("racing") ||
    norm.includes("f1") ||
    norm.includes("dazn") ||
    norm.includes("willow") ||
    norm.includes("eurosport") ||
    norm.includes("premier") ||
    norm.includes("football") ||
    norm.includes("soccer") ||
    norm.includes("cricket")
  ) {
    catIds.add("sports");
    catNames.add("Sports");
  }

  if (
    norm.includes("news") ||
    norm.includes("cnn") ||
    norm.includes("msnbc") ||
    norm.includes("fox news") ||
    norm.includes("bbc news") ||
    norm.includes("bloomberg") ||
    norm.includes("cnbc") ||
    norm.includes("weather")
  ) {
    catIds.add("news");
    catNames.add("News");
  }

  if (
    norm.includes("hbo") ||
    norm.includes("cinemax") ||
    norm.includes("starz") ||
    norm.includes("showtime") ||
    norm.includes("amc") ||
    norm.includes("movie") ||
    norm.includes("film") ||
    norm.includes("cinema") ||
    norm.includes("fx")
  ) {
    catIds.add("movies");
    catNames.add("Movies");
  }

  if (
    norm.includes("cartoon") ||
    norm.includes("nickelodeon") ||
    norm.includes("disney") ||
    norm.includes("nick") ||
    norm.includes("boomerang") ||
    norm.includes("kids") ||
    norm.includes("junior")
  ) {
    catIds.add("kids");
    catNames.add("Kids");
  }

  if (
    norm.includes("music") ||
    norm.includes("mtv") ||
    norm.includes("vh1")
  ) {
    catIds.add("music");
    catNames.add("Music");
  }

  // Fallback to General / Entertainment
  if (catIds.size === 0) {
    catIds.add("general");
    catNames.add("General");
  }

  return {
    categories: Array.from(catIds),
    categoryNames: Array.from(catNames),
  };
}

// Country helper
function detectCountry(name: string): { country: string; countryName: string } {
  const norm = name.toLowerCase();
  if (norm.includes("uk") || norm.includes("british") || norm.includes("bbc") || norm.includes("sky") || norm.includes("itv")) {
    return { country: "GB", countryName: "United Kingdom" };
  }
  if (norm.includes("ca") || norm.includes("canada")) {
    return { country: "CA", countryName: "Canada" };
  }
  if (norm.includes("au") || norm.includes("australia")) {
    return { country: "AU", countryName: "Australia" };
  }
  if (norm.includes("de") || norm.includes("germany")) {
    return { country: "DE", countryName: "Germany" };
  }
  if (norm.includes("fr") || norm.includes("france")) {
    return { country: "FR", countryName: "France" };
  }
  if (norm.includes("es") || norm.includes("spain")) {
    return { country: "ES", countryName: "Spain" };
  }
  if (norm.includes("it") || norm.includes("italy")) {
    return { country: "IT", countryName: "Italy" };
  }
  if (norm.includes("in") || norm.includes("india")) {
    return { country: "IN", countryName: "India" };
  }

  return { country: "US", countryName: "United States" };
}

// Generate the 6 DLHD server sources
export function getDLHDServers(channelId: string): StreamServer[] {
  return [
    {
      id: `dlhd-${channelId}-stream`,
      name: "DLHD Server 1 (Stream)",
      url: `https://dlhd.st/stream/stream-${channelId}.php`,
      type: "iframe",
      source: "dlhd",
      isPrimary: true,
    },
    {
      id: `dlhd-${channelId}-cast`,
      name: "DLHD Server 2 (Cast)",
      url: `https://dlhd.st/cast/stream-${channelId}.php`,
      type: "iframe",
      source: "dlhd",
    },
    {
      id: `dlhd-${channelId}-watch`,
      name: "DLHD Server 3 (Watch)",
      url: `https://dlhd.st/watch/stream-${channelId}.php`,
      type: "iframe",
      source: "dlhd",
    },
    {
      id: `dlhd-${channelId}-plus`,
      name: "DLHD Server 4 (Plus)",
      url: `https://dlhd.st/plus/stream-${channelId}.php`,
      type: "iframe",
      source: "dlhd",
    },
    {
      id: `dlhd-${channelId}-player`,
      name: "DLHD Server 5 (Player)",
      url: `https://dlhd.st/player/stream-${channelId}.php`,
      type: "iframe",
      source: "dlhd",
    },
    {
      id: `dlhd-${channelId}-casting`,
      name: "DLHD Server 6 (Casting)",
      url: `https://dlhd.st/casting/stream-${channelId}.php`,
      type: "iframe",
      source: "dlhd",
    },
  ];
}

// Fetch DLHD 24/7 channels
export async function fetchDLHDChannels(): Promise<Channel[]> {
  try {
    const res = await fetch("https://dlhd.st/24-7-channels.php", {
      next: { revalidate: 21600 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      console.warn("DLHD channels fetch status:", res.status);
      return [];
    }

    const html = await res.text();
    const watchRegex = /<a[^>]+href=["']\/(?:watch\.php\?id=|stream\/stream-)(\d+)(?:\.php)?["'][^>]*data-title=["']([^"']+)["'][^>]*>/gi;

    const dlhdRawMap = new Map<string, DLHDRawChannel>();
    let m;
    while ((m = watchRegex.exec(html)) !== null) {
      const id = m[1];
      const rawName = m[2]
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .trim();

      if (!dlhdRawMap.has(id)) {
        dlhdRawMap.set(id, { id, name: rawName });
      }
    }

    // Convert raw DLHD channels to Channel objects
    const channels: Channel[] = [];

    for (const [id, raw] of dlhdRawMap.entries()) {
      const { categories, categoryNames } = detectCategories(raw.name);
      const { country, countryName } = detectCountry(raw.name);
      const servers = getDLHDServers(id);
      const logo = getLogoForDLHDChannel(raw.name, raw.logoUrl);

      channels.push({
        id: `dlhd-${id}`,
        name: raw.name,
        altNames: [raw.name.toLowerCase()],
        network: "DLHD Network",
        country,
        countryName,
        categories,
        categoryNames,
        logo,
        streamUrl: servers[0].url,
        streamUrls: [servers[0].url],
        servers,
        defaultServerId: servers[0].id,
        quality: "HD",
        website: `https://dlhd.st/stream/stream-${id}.php`,
        hasDlhd: true,
        hasIptvOrg: false,
      });
    }

    console.log(`📡 Successfully fetched ${channels.length} DLHD channels`);
    return channels;
  } catch (error) {
    console.error("Error fetching DLHD channels:", error);
    return [];
  }
}
