import { fetchCustomChannels } from "@/lib/iptv/fetch-custom-channels";
import { CustomChannelsBrowseGrid } from "@/components/CustomChannelsBrowseGrid";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Custom 24/7 Channels & Doraemon TV — IPTV Only",
  description:
    "Watch non-stop 24/7 custom cartoon and anime streams — including Doraemon 24/7, Shinchan 24/7, Pokemon 24/7, DBZ, and classic cartoons.",
  openGraph: {
    title: "Custom 24/7 Channels & Doraemon TV — IPTV Only",
    description:
      "Watch Doraemon 24/7 live continuous episode stream and custom cartoon channels online for free.",
    siteName: "IPTV Only",
    type: "website",
  },
};

export default async function CustomChannelsPage() {
  const channels = await fetchCustomChannels();

  return (
    <div className="py-2">
      <CustomChannelsBrowseGrid channels={channels} />
    </div>
  );
}
