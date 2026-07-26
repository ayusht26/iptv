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

export type Language = {
  code: string;
  name: string;
};
