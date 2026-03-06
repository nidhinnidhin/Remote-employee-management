"use client";

import React, { useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { Header } from "../common/Header";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        document.documentElement.classList.add("theme-super");
        return () => {
            document.documentElement.classList.remove("theme-super");
        };
    }, []);

    return (
        <div className="theme-super portal-page min-h-screen flex">
            {/* Sidebar - Hidden on mobile, fixed on desktop */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
