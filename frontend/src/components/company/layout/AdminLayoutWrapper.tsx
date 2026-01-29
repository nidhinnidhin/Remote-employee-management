"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="bg-neutral-950 min-h-screen">
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

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayoutWrapper;
