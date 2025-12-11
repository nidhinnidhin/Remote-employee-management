import Link from "next/link";
import React from "react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-500 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">SuperAdmin</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                    <a href="#features" className="hover:text-rose-500 transition-colors">Features</a>
                    <a href="#capabilities" className="hover:text-rose-500 transition-colors">Capabilities</a>
                    <a href="#stats" className="hover:text-rose-500 transition-colors">Stats</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/super-admin-login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
                    <Link href="/super-admin-login" className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40">
                        Access Portal
                    </Link>
                </div>
            </div>
        </nav>
    );
}
