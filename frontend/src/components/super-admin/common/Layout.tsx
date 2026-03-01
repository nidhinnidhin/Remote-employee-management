"use client";

import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  useEffect(() => {
    document.documentElement.classList.add("theme-super");
    return () => {
      document.documentElement.classList.remove("theme-super");
    };
  }, []);

  return (
    <div className="theme-super portal-page min-h-screen font-sans">
      <Sidebar />
      <TopBar />

      <main className="lg:ml-64 p-6 min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}
