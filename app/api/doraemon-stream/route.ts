import { NextResponse } from "next/server";
import { getRandomShowEpisode, getShowBySlug, SHOWS_DATA } from "@/lib/iptv/custom-shows-data";

export const revalidate = 0; // Dynamic route

// Show-specific fallback stream URLs (NEVER fallback non-Doraemon shows to Doraemon!)
const SHOW_FALLBACKS: Record<string, { streamUrl: string; servers: { name: string; url: string }[] }> = {
  "naruto-247": {
    streamUrl: "https://as-cdn21.top/video/36660e59856b4de58a219bcf4e27eba3",
    servers: [
      { name: "Server 1 (AS-CDN)", url: "https://as-cdn21.top/video/36660e59856b4de58a219bcf4e27eba3" },
      { name: "Server 2 (RubyStm)", url: "https://rubystm.com/e/1ar22v23frcs.html" },
      { name: "Server 3 (HQ)", url: "https://piratexplay.cc/public/player/index11.php?id=c0iihdr" },
      { name: "Server 4 (Vidstreaming)", url: "https://vidstreaming.xyz/v/V2RG6YD4QbI9/" },
    ],
  },
  "pokemon-247": {
    streamUrl: "https://bysezejataos.com/e/1zrtewhd4lmg/",
    servers: [
      { name: "Server 1 (Byse)", url: "https://bysezejataos.com/e/1zrtewhd4lmg/" },
      { name: "Server 2 (HQ)", url: "https://piratexplay.cc/public/player/index11.php?id=mhpa7te" },
      { name: "Server 3 (Vidstreaming)", url: "https://vidstreaming.xyz/v/81QYvFPfqKgN/" },
    ],
  },
  "shinchan-247": {
    streamUrl: "https://as-cdn21.top/video/e6be4c22a5963ab00dfe8f3b695b5332",
    servers: [
      { name: "Server 1 (AS-CDN)", url: "https://as-cdn21.top/video/e6be4c22a5963ab00dfe8f3b695b5332" },
      { name: "Server 2 (HQ)", url: "https://piratexplay.cc/public/player/index11.php?id=ny6nz5s" },
      { name: "Server 3 (Vidstreaming)", url: "https://vidstreaming.xyz/v/BS8gIKMf3jom/" },
    ],
  },
  "ben10-247": {
    streamUrl: "https://rubystm.com/e/fa4y7r039ubd.html",
    servers: [
      { name: "Server 1 (RubyStm)", url: "https://rubystm.com/e/fa4y7r039ubd.html" },
      { name: "Server 2 (HQ)", url: "https://piratexplay.cc/public/player/index11.php?id=c8hlz1l" },
      { name: "Server 3 (Vidstreaming)", url: "https://vidmoly.net/embed-elgl2zi3eqzk.html" },
    ],
  },
  "spiderman-247": {
    streamUrl: "https://as-cdn21.top/video/5dedb42b34e50082065a783265ce28a8",
    servers: [
      { name: "Server 1 (AS-CDN)", url: "https://as-cdn21.top/video/5dedb42b34e50082065a783265ce28a8" },
      { name: "Server 2 (HQ)", url: "https://piratexplay.cc/public/player/index11.php?id=zyspbfa" },
      { name: "Server 3 (Vidstreaming)", url: "https://vidstreaming.xyz/v/MHXvxaDqH6GJ/" },
    ],
  },
  "doraemon-247": {
    streamUrl: "https://bysezejataos.com/e/1zrtewhd4lmg/",
    servers: [
      { name: "Server 1 (Byse)", url: "https://bysezejataos.com/e/1zrtewhd4lmg/" },
      { name: "Server 2 (HQ)", url: "https://piratexplay.cc/public/player/index11.php?id=yfvrl19" },
    ],
  },
};

async function resolveEpisodeServers(epUrl: string): Promise<{ name: string; url: string }[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(epUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);
    if (!res.ok) return [];
    const html = await res.text();

    const serversList: { name: string; url: string }[] = [];

    // Match all iframe src links
    const iframeMatches = [...html.matchAll(/<iframe[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);

    for (let i = 0; i < iframeMatches.length; i++) {
      let rawUrl = iframeMatches[i];

      // Normalize proxy URLs
      if (rawUrl.includes("proxy/play.php?url=")) {
        const parts = rawUrl.split("proxy/play.php?url=");
        if (parts[1]) rawUrl = decodeURIComponent(parts[1]);
      }

      // Ignore tracking or non-video iframe URLs
      if (
        rawUrl.includes("animesalt.link") ||
        rawUrl.includes("cdn-cgi") ||
        rawUrl.includes("google") ||
        rawUrl.includes("facebook")
      ) {
        continue;
      }

      // Format clean server label
      let serverName = `Server ${serversList.length + 1}`;
      if (rawUrl.includes("as-cdn")) serverName = `Server ${serversList.length + 1} (AS-CDN)`;
      else if (rawUrl.includes("byse")) serverName = `Server ${serversList.length + 1} (Byse)`;
      else if (rawUrl.includes("rubystm")) serverName = `Server ${serversList.length + 1} (RubyStm)`;
      else if (rawUrl.includes("index11")) serverName = `Server ${serversList.length + 1} (HQ)`;
      else if (rawUrl.includes("vidstreaming")) serverName = `Server ${serversList.length + 1} (Vidstream)`;
      else if (rawUrl.includes("gdmirror")) serverName = `Server ${serversList.length + 1} (GD-Mirror)`;

      if (!serversList.some((s) => s.url === rawUrl)) {
        serversList.push({ name: serverName, url: rawUrl });
      }
    }

    // Also inspect index11.php if present to extract inner servers
    const index11Match = iframeMatches.find((u) => u.includes("index11.php"));
    if (index11Match) {
      try {
        const idxRes = await fetch(index11Match, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Referer: epUrl,
          },
          next: { revalidate: 3600 },
        });
        if (idxRes.ok) {
          const idxHtml = await idxRes.text();
          const byseInner = idxHtml.match(/https:\/\/bysezejataos\.com\/e\/[a-z0-9]+\//i);
          if (byseInner && !serversList.some((s) => s.url === byseInner[0])) {
            serversList.unshift({ name: "Server 1 (Byse Direct)", url: byseInner[0] });
          }
        }
      } catch (err) {
        console.warn("Index11 inner fetch error:", err);
      }
    }

    return serversList;
  } catch (error) {
    clearTimeout(timeoutId);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showId = searchParams.get("show") || searchParams.get("channelId") || "doraemon-247";
    const reqSeason = searchParams.get("season");
    const reqEpisode = searchParams.get("episode");
    let pageUrl = searchParams.get("url");

    const fallback = SHOW_FALLBACKS[showId] || SHOW_FALLBACKS["doraemon-247"];
    let epInfo = getRandomShowEpisode(showId);

    if (reqSeason && reqEpisode) {
      const show = getShowBySlug(showId);
      const seasonNum = parseInt(reqSeason, 10);
      const epNum = parseInt(reqEpisode, 10);
      const episodeSlug = `${seasonNum}x${epNum}`;
      pageUrl = `https://piratexplay.cc/episode/${show.slug}-season-${seasonNum}-${show.idCode}-${episodeSlug}/`;
      epInfo = {
        showId: show.id,
        showName: show.name,
        season: seasonNum,
        episode: epNum,
        episodeSlug,
        pageUrl,
      };
    } else if (!pageUrl) {
      pageUrl = epInfo.pageUrl;
    }

    let servers = await resolveEpisodeServers(pageUrl);

    // If first attempt returned 0 servers and no specific season requested, retry once with another episode
    if (servers.length === 0 && (!reqSeason || !reqEpisode)) {
      const retryEp = getRandomShowEpisode(showId);
      servers = await resolveEpisodeServers(retryEp.pageUrl);
      if (servers.length > 0) {
        epInfo = retryEp;
        pageUrl = retryEp.pageUrl;
      }
    }

    const finalServers = servers.length > 0 ? servers : fallback.servers;
    const finalStreamUrl = finalServers[0]?.url || fallback.streamUrl;

    return NextResponse.json({
      success: true,
      showId: epInfo.showId,
      showName: epInfo.showName,
      season: epInfo.season,
      episode: epInfo.episode,
      streamUrl: finalStreamUrl,
      servers: finalServers,
      pageUrl,
    });
  } catch (error) {
    console.error("Error in stream route:", error);
    const fallback = SHOW_FALLBACKS["naruto-247"];
    return NextResponse.json({
      success: true,
      streamUrl: fallback.streamUrl,
      servers: fallback.servers,
    });
  }
}
