"use client";

import React, { useEffect } from "react";
import { Sidebar } from "../common/Sidebar";
import { Header } from "../common/Header";
import { useProfileStore } from "@/store/profile.store";

/**
 * ChatLayout — same shell as DashboardLayout but the main area has NO
 * overflow/padding/max-width wrapper so the chat fills the entire space.
 */
export function ChatLayout({ children }: { children: React.ReactNode }) {
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  useEffect(() => {
    document.documentElement.classList.add("theme-employee");
    fetchProfile();
    return () => {
      document.documentElement.classList.remove("theme-employee");
    };
  }, [fetchProfile]);

  return (
    <div className="theme-employee portal-page h-screen flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        {/* No padding, no max-width — chat fills the remaining space */}
        <main className="flex-1 overflow-hidden p-3 md:p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
