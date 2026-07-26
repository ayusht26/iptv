import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { ChannelBrowseGrid } from "@/components/ChannelBrowseGrid";

export const revalidate = 21600;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    country?: string;
    lang?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { channels, categories, countries, languages } = await fetchIPTVData();
  const resolvedParams = await searchParams;

  const category = resolvedParams?.category || "";
  const country = resolvedParams?.country || "";
  const lang = resolvedParams?.lang || "";

  return (
    <ChannelBrowseGrid
      channels={channels}
      categories={categories}
      countries={countries}
      languages={languages}
      initialCategory={category}
      initialCountry={country}
      initialLanguage={lang}
    />
  );
}
