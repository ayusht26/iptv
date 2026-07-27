"use client";

import React, { useState, useEffect } from "react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { QuickSearchModal } from "@/components/QuickSearchModal";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Listen for Ctrl+K / Cmd+K global shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <TopNav onOpenSearch={() => setSearchModalOpen(true)} />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-6 py-6">
        {children}
      </main>
      <Footer />
      <QuickSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}

