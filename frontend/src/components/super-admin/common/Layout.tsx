"use client";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <TopBar />

      <main className="lg:ml-64 p-6 min-h-[calc(100vh-64px)]">{children}</main>
    </div>
  );
}
