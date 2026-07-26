import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistDisplay.variable} ${interBody.variable} h-full antialiased dark`}
    >
      <body className="bg-canvas text-ink min-h-full flex flex-col selection:bg-accent-blue/30 selection:text-white">
        <TopNav />
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
