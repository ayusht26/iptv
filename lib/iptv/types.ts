export type Channel = {
  id: string;
  name: string;
  altNames: string[];
  network: string | null;
  country: string;
  countryName: string;
  categories: string[];
  categoryNames: string[];
  logo: string | null;
  streamUrl: string | null;
  streamUrls: string[];
  quality: string | null;
  website: string | null;
};

export type Category = {
  id: string;
  name: string;
};

export type Country = {
  code: string;
  name: string;
};

export type CustomChannelEpisode = {
  id: string;
  title: string;
  season?: string;
  episodeNumber?: number;
  duration?: string;
  thumbnail?: string;
  streamUrl?: string;
  embedUrl?: string;
  servers?: {
    name: string;
    url: string;
    type: "hls" | "mp4" | "iframe";
  }[];
};

export type CustomChannel = {
  id: string;
  name: string;
  slug: string;
  shortSlug?: string;
  description: string;
  logo: string | null;
  category: string;
  badge?: string;
  is247: boolean;
  featured?: boolean;
  episodes: CustomChannelEpisode[];
  sourceUrl?: string;
};
