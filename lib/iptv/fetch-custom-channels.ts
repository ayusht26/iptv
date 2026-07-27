import { CustomChannel } from "./types";
import { cache } from "react";
import { SHOWS_DATA } from "./custom-shows-data";

const CUSTOM_CHANNELS_LIST: CustomChannel[] = Object.values(SHOWS_DATA).map(
  (show) => ({
    id: show.id,
    slug: show.shortSlug,
    shortSlug: show.shortSlug,
    name: show.name,
    description: show.description,
    logo: null,
    category: show.category,
    badge: "24/7 LIVE",
    is247: true,
    featured: show.id === "doraemon-247" || show.id === "pokemon-247",
    sourceUrl: show.sourceUrl,
    episodes: [
      {
        id: `${show.id}-default`,
        title: `${show.name} Continuous Stream`,
        season: "All Seasons",
        episodeNumber: 1,
        duration: "21:00",
        embedUrl: "https://bysezejataos.com/e/1zrtewhd4lmg/",
        servers: [
          {
            name: "Server 1 (HD)",
            url: "https://bysezejataos.com/e/1zrtewhd4lmg/",
            type: "iframe" as const,
          },
        ],
      },
    ],
  })
);

export const fetchCustomChannels = cache(async (): Promise<CustomChannel[]> => {
  return CUSTOM_CHANNELS_LIST;
});
