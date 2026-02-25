"use client";

import React from "react";
import { Sidebar } from "../common/Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-employee portal-page h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8 pb-8">{children}</div>
      </main>
    </div>
  );
}
