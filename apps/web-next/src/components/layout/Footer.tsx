import React from "react";

export default function Footer() {
    return (
        <footer className="py-12 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-500 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900">SuperAdmin Portal</span>
                </div>
                <p className="text-gray-400 text-sm">© 2024 SuperAdmin. Secure. Reliable. Powerful.</p>
                <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <a href="#" className="hover:text-rose-500">Security</a>
                    <a href="#" className="hover:text-rose-500">Docs</a>
                    <a href="#" className="hover:text-rose-500">Support</a>
                </div>
            </div>
        </footer>
    );
}
