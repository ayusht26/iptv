import React from "react";
import Link from "next/link";
import { Tv, ShieldAlert } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";

export function Footer() {
  return (
    <footer className="w-full bg-canvas border-t border-hairline-soft mt-auto py-12 md:py-16">
      <div className="max-w-[1200px] w-full mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-hairline-soft">
          {/* Brand & Mission */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-surface-2 border border-hairline flex items-center justify-center text-ink">
                <Tv className="w-3.5 h-3.5 text-ink" />
              </div>
              <span className="font-display text-base font-medium tracking-tight text-ink">
                IPTV<span className="text-ink-muted">Only</span>
              </span>
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              Thousands of publicly available live TV channels in one clean, dark tab. Powered by the open-source community.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/ayusht26"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-9 h-9 rounded-full bg-surface-1 hover:bg-surface-2 border border-hairline flex items-center justify-center text-ink transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/ayush-t26/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-full bg-surface-1 hover:bg-surface-2 border border-hairline flex items-center justify-center text-ink transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-semibold text-ink tracking-wide uppercase">
              Navigation
            </span>
            <Link href="/" className="text-xs text-ink-muted hover:text-ink transition-colors">
              Browse Channels
            </Link>
            <Link href="/#categories" className="text-xs text-ink-muted hover:text-ink transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-xs text-ink-muted hover:text-ink transition-colors">
              About & Creator
            </Link>
          </div>

          {/* Data Attribution */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-semibold text-ink tracking-wide uppercase">
              Data & Source
            </span>
            <p className="text-xs text-ink-muted leading-relaxed">
              Channel indexing & playlist metadata provided by the open-source{" "}
              <a
                href="https://github.com/iptv-org/iptv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                iptv-org project
              </a>
              .
            </p>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-ink-muted">
          <div className="flex items-start gap-2 max-w-2xl">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-ink-muted" />
            <p className="leading-relaxed">
              <strong className="text-ink font-medium">Legal Disclaimer:</strong> IPTV Only does not host, store, or stream any media files directly. All channel links are publicly accessible third-party HLS streams aggregated from the community index. If a stream violates copyright, please contact the stream host or report it directly to iptv-org.
            </p>
          </div>
          <div className="shrink-0 text-ink-muted">
            &copy; {new Date().getFullYear()} IPTV Only by{" "}
            <a
              href="https://github.com/ayusht26"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent-blue transition-colors font-medium"
            >
              Ayush T
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
