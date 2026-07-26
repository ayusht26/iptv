"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(() => {
    const matched = items.find((item) => item.url === pathname);
    return matched ? matched.name : items[0].name;
  });

  useEffect(() => {
    const matched = items.find((item) => item.url === pathname);
    if (matched) {
      setActiveTab(matched.name);
    }
  }, [pathname, items]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className="flex items-center gap-1 sm:gap-1.5 bg-surface-1/90 border border-hairline/80 backdrop-blur-lg py-1 px-1.5 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-1.5 rounded-full transition-colors flex items-center gap-2",
                "text-ink-muted hover:text-ink",
                isActive && "bg-surface-2 text-ink"
              )}
            >
              <Icon
                size={16}
                strokeWidth={2.2}
                className={cn(isActive ? "text-ink" : "text-ink-muted")}
              />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 w-full bg-surface-2 border border-hairline rounded-full -z-10 shadow-sm"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
