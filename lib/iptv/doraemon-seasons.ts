export type SeasonInfo = {
  season: number;
  episodesCount: number;
};

// Exact Doraemon seasons & episode counts provided by user
export const DORAEMON_SEASONS_DATA: SeasonInfo[] = [
  { season: 1, episodesCount: 52 },
  { season: 2, episodesCount: 51 },
  { season: 3, episodesCount: 52 },
  { season: 4, episodesCount: 52 },
  { season: 5, episodesCount: 52 },
  { season: 6, episodesCount: 52 },
  { season: 7, episodesCount: 52 },
  { season: 8, episodesCount: 51 },
  // Season 9, 10, 11 not there
  { season: 12, episodesCount: 52 },
  { season: 13, episodesCount: 7 },
  { season: 14, episodesCount: 52 },
  { season: 15, episodesCount: 52 },
  { season: 16, episodesCount: 52 },
  { season: 17, episodesCount: 52 },
  { season: 18, episodesCount: 52 },
];

export function getRandomDoraemonEpisode() {
  const randomSeasonObj =
    DORAEMON_SEASONS_DATA[Math.floor(Math.random() * DORAEMON_SEASONS_DATA.length)];
  const season = randomSeasonObj.season;
  const episode = Math.floor(Math.random() * randomSeasonObj.episodesCount) + 1;
  const episodeSlug = `${season}x${episode}`;
  const pageUrl = `https://piratexplay.cc/episode/doraemon-season-${season}-65733-${episodeSlug}/`;

  return {
    season,
    episode,
    episodeSlug,
    pageUrl,
  };
}
