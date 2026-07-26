import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { fetchIPTVData } from "@/lib/iptv/fetch-channels";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geistDisplay = Geist({
  variable: "--font-geist-display",
  subsets: ["latin"],
});

const interBody = Inter({
  variable: "--font-inter-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IPTV Only — Thousands of live TV channels in one tab",
  description:
    "Browse, search, and stream thousands of publicly available live TV channels from around the world. No login, no backend — pure HLS streaming.",
  openGraph: {
    title: "IPTV Only — Thousands of live TV channels in one tab",
    description:
      "Browse, search, and stream thousands of publicly available live TV channels from around the world.",
    siteName: "IPTV Only",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { channels } = await fetchIPTVData();

  return (
    <html
      lang="en"
      className={`${geistDisplay.variable} ${interBody.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="bg-canvas text-ink min-h-full flex flex-col selection:bg-accent-blue/30 selection:text-white"
        suppressHydrationWarning
      >
        <LayoutWrapper channels={channels}>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
