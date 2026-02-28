"use client";

import { Bell, Search } from "lucide-react";

export default function TopBar() {
  return (
    <header
      className="top-nav h-16 flex items-center justify-between px-6 lg:ml-64 relative z-40"
    >
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-accent">Super Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="field-input w-64 pl-10 pr-4 py-2 text-sm"
          />
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgb(var(--color-text-muted))" }}
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 transition-colors"
          style={{ color: "rgb(var(--color-text-secondary))" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{
              backgroundColor: "rgb(var(--color-danger))",
              borderColor: "rgb(var(--color-nav-bg))",
            }}
          />
        </button>

        {/* Profile */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
          style={{ backgroundColor: "rgb(var(--color-accent))" }}
        >
          SA
        </div>
      </div>
    </header>
  );
}
