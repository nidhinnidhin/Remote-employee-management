"use client";

import Link from "next/link";
import PortalPreview from "./PortalPreview";

export default function HeroSection() {
  return (
    <section className="pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Secure Administration Portal
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-4xl mx-auto leading-tight animate-fade-in-up delay-100">
          Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Platform</span> Control
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          The ultimate command center for managing your entire SaaS platform.
          Monitor companies, users, billing, and system health from one powerful dashboard.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up delay-300">
          <Link
            href="/super-admin-login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-rose-500/20 transform hover:-translate-y-0.5 transition-all"
          >
            Access Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
          </Link>

          <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">
            View Documentation
          </button>
        </div>
        <PortalPreview />
      </div>
    </section>
  );
}
