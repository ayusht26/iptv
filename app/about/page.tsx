import React from "react";
import { ShieldAlert, Code2, Users, BookOpen } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — IPTV Only",
  description:
    "Learn more about IPTV Only, an open-source public live TV browser created by Ayush T.",
};

type GitHubUser = {
  avatar_url: string;
  name: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
};

async function getGitHubUserData(): Promise<GitHubUser | null> {
  try {
    const res = await fetch("https://api.github.com/users/ayusht26", {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        "User-Agent": "IPTV-Only-NextJS-App",
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.avatar_url) return null;

    return {
      avatar_url: data.avatar_url,
      name: data.name || "Ayush T",
      bio: data.bio || "Full-Stack Software Engineer & Open-Source Contributor",
      public_repos: data.public_repos ?? 0,
      followers: data.followers ?? 0,
      html_url: data.html_url || "https://github.com/ayusht26",
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return null;
  }
}

export default async function AboutPage() {
  const ghUser = await getGitHubUserData();

  // Fallback defaults if GitHub API rate limits or fails
  const creator = {
    name: ghUser?.name || "Ayush T",
    avatarUrl: ghUser?.avatar_url || "https://github.com/ayusht26.png",
    bio:
      ghUser?.bio ||
      "Full-stack developer building clean, responsive web applications.",
    repos: ghUser?.public_repos ?? 25,
    followers: ghUser?.followers ?? 10,
    githubUrl: ghUser?.html_url || "https://github.com/ayusht26",
    linkedinUrl: "https://www.linkedin.com/in/ayush-t26/",
  };

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-16 space-y-10">
      {/* Page Title & Intro */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-surface-1 border border-hairline px-3 py-1 rounded-pill text-xs text-ink-muted">
          <span>Non-Commercial Open Source Project</span>
        </div>
        <h1 className="display-xl text-ink font-medium tracking-tight">
          About IPTV Only
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-xl mx-auto">
          A minimalist, fast web application for exploring publicly available live television streams across the world without ads, logins, or paywalls.
        </p>
      </div>

      {/* Main About Panel styled per DESIGN.md pricing-card */}
      <div className="bg-surface-1 border border-hairline rounded-xl p-6 md:p-8 space-y-8 shadow-xl">
        {/* Creator Profile Card Section */}
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-blue">
            Created By
          </span>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-surface-2 border border-hairline rounded-lg p-5">
            <div className="flex items-center gap-4">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-16 h-16 rounded-full border border-hairline object-cover shrink-0"
              />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-ink">
                  {creator.name}
                </h3>
                <p className="text-xs text-ink-muted leading-snug">
                  {creator.bio}
                </p>
                <div className="flex items-center gap-4 text-xs text-ink-muted pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-accent-blue" />
                    <strong className="text-ink">{creator.repos}</strong> Repos
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-accent-blue" />
                    <strong className="text-ink">{creator.followers}</strong> Followers
                  </span>
                </div>
              </div>
            </div>

            {/* Social Action Pills */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <a
                href={creator.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-10 h-10 rounded-full bg-surface-1 hover:bg-hairline text-ink border border-hairline flex items-center justify-center transition-colors"
                title="View GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={creator.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-10 h-10 rounded-full bg-surface-1 hover:bg-hairline text-ink border border-hairline flex items-center justify-center transition-colors"
                title="View LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4 text-accent-blue" />
              </a>
            </div>
          </div>
        </div>

        {/* Open Source & Attribution */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-ink font-semibold text-sm">
            <BookOpen className="w-4 h-4 text-accent-blue" />
            <h3>Data Attribution & Open Source</h3>
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            All channel metadata, category mappings, and stream URL indices are retrieved dynamically from the open-source{" "}
            <a
              href="https://github.com/iptv-org/iptv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline font-medium"
            >
              iptv-org/iptv repository
            </a>
            . We extend our immense gratitude to the thousands of contributors who maintain this public channel index.
          </p>
        </div>

        {/* Legal Statement */}
        <div className="bg-canvas border border-hairline-soft rounded-md p-4 flex items-start gap-3 text-xs text-ink-muted">
          <ShieldAlert className="w-5 h-5 text-ink shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-ink font-semibold">Legal & Copyright Statement</h4>
            <p className="leading-relaxed">
              IPTV Only stores no video files or live stream data on its servers. This website acts solely as an aggregator linking to publicly available third-party stream links across the internet. If you believe a linked stream infringes your intellectual property, please submit a removal request directly to the host server or file an issue on the upstream iptv-org project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
