"use client";
import { Search, Bell } from "lucide-react";

export default function Header({ title }: { title: string }) {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
            <div>
                <h1 className="text-2xl font-bold text-violet-600">{title}</h1>
                <p className="text-sm text-gray-500">Manage all registered companies</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-violet-100 w-64 placeholder:text-gray-400"
                    />
                </div>

                <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                    SA
                </div>
            </div>
        </header>
    );
}
