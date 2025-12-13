"use client";

import StatCard from "@/components/features/dashboard/StatCard";

export default function PortalPreview() {
  const stats = [
    {
      l: "Total Companies",
      v: "512",
      c: "bg-rose-50 text-rose-600",
      i: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5M5 21H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      l: "Active Users",
      v: "48.2K",
      c: "bg-purple-50 text-purple-600",
      i: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      l: "Revenue (MTD)",
      v: "$284K",
      c: "bg-green-50 text-green-600",
      i: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      l: "System Health",
      v: "99.9%",
      c: "bg-blue-50 text-blue-600",
      i: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor">
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/50 animate-fade-in-up delay-500">
      <div className="absolute top-0 left-0 right-0 h-11 bg-gray-50 border-b rounded-t-xl flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 bg-red-400 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-400 rounded-full"></span>
        </div>
        <div className="mx-auto text-xs text-gray-400">
          superadmin-portal.app
        </div>
      </div>
      <div className="mt-11 p-6 bg-gray-50/50 rounded-b-xl min-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <StatCard
              key={i}
              label={s.l}
              value={s.v}
              className={s.c}
              icon={s.i}
            />
          ))}
        </div>
        <div className="bg-white border rounded-xl h-48 flex items-center justify-center gap-4 p-8">
          {[0, 75, 100, 150, 200, 300].map((d, i) => (
            <div
              key={i}
              className={`h-full w-16 bg-rose-100 rounded-lg animate-pulse`}
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
