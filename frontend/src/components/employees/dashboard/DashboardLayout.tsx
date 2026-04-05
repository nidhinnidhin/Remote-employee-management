"use client";

import React, { useEffect } from "react";
import { Sidebar } from "../common/Sidebar";
import { Header } from "../common/Header";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("theme-employee");
    return () => {
      document.documentElement.classList.remove("theme-employee");
    };
  }, []);

  return (
    <div className="theme-employee portal-page h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="max-w-7xl mx-auto space-y-8 pb-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
