import { NextResponse } from "next/server";
import { getRandomShowEpisode } from "@/lib/iptv/custom-shows-data";

export const revalidate = 0; // Dynamic route

const FALLBACK_STREAM = "https://bysezejataos.com/e/1zrtewhd4lmg/";

async function resolveCleanEmbedStream(epUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

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
    if (!res.ok) return null;
    const html = await res.text();

    const playerEmbedMatch = html.match(
      /src=["'](https:\/\/piratexplay\.cc\/public\/player\/index11\.php\?id=[^"']+)["']/
    );

    if (!playerEmbedMatch) return null;
    const indexUrl = playerEmbedMatch[1];

    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 3500);

    const indexRes = await fetch(indexUrl, {
      signal: controller2.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: epUrl,
      },
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId2);
    if (!indexRes.ok) return indexUrl;
    const indexHtml = await indexRes.text();

    const byseMatch = indexHtml.match(/https:\/\/bysezejataos\.com\/e\/[a-z0-9]+\//i);
    if (byseMatch) {
      return byseMatch[0];
    }

    return indexUrl;
  } catch (error) {
    clearTimeout(timeoutId);
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showId = searchParams.get("show") || searchParams.get("channelId") || "doraemon-247";
    let pageUrl = searchParams.get("url");

    let randomEp = getRandomShowEpisode(showId);
    if (!pageUrl) {
      pageUrl = randomEp.pageUrl;
    }

    let streamUrl = await resolveCleanEmbedStream(pageUrl);

    // Retry once with another random episode if initial resolution failed
    if (!streamUrl) {
      const retryEp = getRandomShowEpisode(showId);
      streamUrl = await resolveCleanEmbedStream(retryEp.pageUrl);
      if (streamUrl) {
        randomEp = retryEp;
        pageUrl = retryEp.pageUrl;
      }
    }

    const finalStreamUrl = streamUrl || FALLBACK_STREAM;

    return NextResponse.json({
      success: true,
      showId: randomEp.showId,
      showName: randomEp.showName,
      season: randomEp.season,
      episode: randomEp.episode,
      streamUrl: finalStreamUrl,
      pageUrl,
    });
  } catch (error) {
    console.error("Error in stream route:", error);
    return NextResponse.json({
      success: true,
      streamUrl: FALLBACK_STREAM,
    });
  }
}
