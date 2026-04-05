"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Forces the entire document to use the Company Admin palette
    document.documentElement.classList.add("theme-company");
    document.documentElement.classList.remove("theme-employee"); // Ensure no conflict
    
    return () => {
      document.documentElement.classList.remove("theme-company");
    };
  }, []);

  return (
    // Applying theme-company here ensures all standard children use the correct vars
    <div className="theme-company portal-page min-h-screen selection:bg-accent/30">
      <Sidebar
        isMobileOpen={sidebarOpen}
        closeMobileSidebar={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div
        className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen
          ${isCollapsed ? "lg:pl-20" : "lg:pl-64"}
        `}
      >
        <Header onMobileMenuDatas={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;