export type ShowSeasonInfo = {
  season: number;
  episodesCount: number;
};

export type ShowConfig = {
  id: string;
  shortSlug: string;
  name: string;
  slug: string;
  idCode: string;
  category: string;
  description: string;
  sourceUrl: string;
  seasons: ShowSeasonInfo[];
};

export const SHOWS_DATA: Record<string, ShowConfig> = {
  "doraemon-247": {
    id: "doraemon-247",
    shortSlug: "doraemon",
    name: "Doraemon 24/7",
    slug: "doraemon",
    idCode: "65733",
    category: "Cartoons",
    description: "Non-stop 24/7 live stream of Doraemon episodes! Plays random continuous episodes.",
    sourceUrl: "https://piratexplay.cc/series/doraemon-season-15-65733",
    seasons: [
      { season: 1, episodesCount: 52 },
      { season: 2, episodesCount: 51 },
      { season: 3, episodesCount: 52 },
      { season: 4, episodesCount: 52 },
      { season: 5, episodesCount: 52 },
      { season: 6, episodesCount: 52 },
      { season: 7, episodesCount: 52 },
      { season: 8, episodesCount: 51 },
      { season: 12, episodesCount: 52 },
      { season: 13, episodesCount: 7 },
      { season: 14, episodesCount: 52 },
      { season: 15, episodesCount: 52 },
      { season: 16, episodesCount: 52 },
      { season: 17, episodesCount: 52 },
      { season: 18, episodesCount: 52 },
    ],
  },
  "pokemon-247": {
    id: "pokemon-247",
    shortSlug: "pokemon",
    name: "Pokémon 24/7",
    slug: "pokemon",
    idCode: "60572",
    category: "Anime",
    description: "Continuous 24/7 stream of Pokémon episodes from Season 1 to Season 20!",
    sourceUrl: "https://piratexplay.cc/series/pokemon-season-23-60572/",
    seasons: [
      { season: 1, episodesCount: 82 },
      { season: 2, episodesCount: 63 },
      { season: 3, episodesCount: 41 },
      { season: 4, episodesCount: 52 },
      { season: 5, episodesCount: 64 },
      { season: 6, episodesCount: 40 },
      { season: 7, episodesCount: 52 },
      { season: 8, episodesCount: 52 },
      { season: 9, episodesCount: 47 },
      { season: 10, episodesCount: 51 },
      { season: 11, episodesCount: 52 },
      { season: 12, episodesCount: 52 },
      { season: 13, episodesCount: 34 },
      { season: 14, episodesCount: 50 },
      { season: 15, episodesCount: 49 },
      { season: 16, episodesCount: 45 },
      { season: 17, episodesCount: 49 },
      { season: 18, episodesCount: 48 },
      { season: 19, episodesCount: 48 },
      { season: 20, episodesCount: 43 },
    ],
  },
  "shinchan-247": {
    id: "shinchan-247",
    shortSlug: "shinchan",
    name: "Shinchan 24/7",
    slug: "shin-chan",
    idCode: "30623",
    category: "Cartoons",
    description: "24/7 non-stop funny episodes of Crayon Shin-chan in continuous 24/7 stream!",
    sourceUrl: "https://piratexplay.cc/series/shin-chan-season-4-30623",
    seasons: [
      { season: 1, episodesCount: 263 },
      { season: 2, episodesCount: 52 },
      { season: 3, episodesCount: 52 },
      { season: 4, episodesCount: 52 },
      { season: 5, episodesCount: 52 },
      { season: 6, episodesCount: 52 },
      { season: 7, episodesCount: 52 },
      { season: 8, episodesCount: 47 },
      { season: 9, episodesCount: 47 },
    ],
  },
  "ben10-247": {
    id: "ben10-247",
    shortSlug: "ben10",
    name: "Ben 10 24/7",
    slug: "ben-10",
    idCode: "4686",
    category: "Cartoons",
    description: "It's Hero Time! 24/7 non-stop Ben 10 classic alien adventures.",
    sourceUrl: "https://piratexplay.cc/series/ben-10-season-1-4686/",
    seasons: [
      { season: 1, episodesCount: 13 },
      { season: 2, episodesCount: 13 },
      { season: 3, episodesCount: 13 },
      { season: 4, episodesCount: 13 },
    ],
  },
  "naruto-247": {
    id: "naruto-247",
    shortSlug: "naruto",
    name: "Naruto 24/7",
    slug: "naruto",
    idCode: "46260",
    category: "Anime",
    description: "24/7 Ninja action! Believe it! Continuous stream of classic Naruto episodes.",
    sourceUrl: "https://piratexplay.cc/series/naruto-season-1-46260/",
    seasons: [
      { season: 1, episodesCount: 57 },
      { season: 2, episodesCount: 104 },
      { season: 3, episodesCount: 158 },
      { season: 4, episodesCount: 220 },
      { season: 5, episodesCount: 220 },
      { season: 6, episodesCount: 160 },
      { season: 7, episodesCount: 186 },
      { season: 8, episodesCount: 212 },
      { season: 9, episodesCount: 220 },
    ],
  },
  "spiderman-247": {
    id: "spiderman-247",
    shortSlug: "spiderman",
    name: "Marvel's Ultimate Spider-Man 24/7",
    slug: "marvel-s-ultimate-spider-man",
    idCode: "34391",
    category: "Cartoons",
    description: "Non-stop 24/7 web-slinging superhero action with Peter Parker & S.H.I.E.L.D.!",
    sourceUrl: "https://piratexplay.cc/series/marvel-s-ultimate-spider-man-season-1-34391",
    seasons: [
      { season: 1, episodesCount: 26 },
      { season: 2, episodesCount: 26 },
      { season: 3, episodesCount: 26 },
      { season: 4, episodesCount: 26 },
    ],
  },
};

// Map short slugs to full show objects
export function getShowBySlug(slug: string): ShowConfig {
  const normalized = slug.toLowerCase();
  for (const show of Object.values(SHOWS_DATA)) {
    if (
      show.id === normalized ||
      show.shortSlug === normalized ||
      show.slug === normalized ||
      show.id.replace("-247", "") === normalized
    ) {
      return show;
    }
  }
  return SHOWS_DATA["doraemon-247"];
}

export function getRandomShowEpisode(showIdentifier: string = "doraemon-247") {
  const show = getShowBySlug(showIdentifier);
  const randomSeasonObj = show.seasons[Math.floor(Math.random() * show.seasons.length)];
  const season = randomSeasonObj.season;
  const episode = Math.floor(Math.random() * randomSeasonObj.episodesCount) + 1;
  const episodeSlug = `${season}x${episode}`;
  const pageUrl = `https://piratexplay.cc/episode/${show.slug}-season-${season}-${show.idCode}-${episodeSlug}/`;

  return {
    showId: show.id,
    showName: show.name,
    season,
    episode,
    episodeSlug,
    pageUrl,
  };
}
