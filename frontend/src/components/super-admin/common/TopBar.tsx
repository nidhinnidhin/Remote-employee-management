"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar() {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:ml-64 relative z-40">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold text-purple-600">Super Admin Panel</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>

                {/* Profile */}
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    SA
                </div>
            </div>
        </header>
    );
}
