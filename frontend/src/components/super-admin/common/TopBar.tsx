import { Bell, Search } from "lucide-react";
import { UserNav } from "@/components/common/UserNav";

export default function TopBar() {
  return (
    <header
      className="top-nav h-16 flex items-center justify-between px-6 lg:ml-64 relative z-40 border-b border-white/[0.05] backdrop-blur-md"
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
            className="field-input w-64 pl-10 pr-4 py-2 text-sm bg-white/5 border-white/10"
          />
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "rgb(var(--color-text-muted))" }}
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 transition-colors hover:text-accent"
          style={{ color: "rgb(var(--color-text-secondary))" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{
              backgroundColor: "rgb(var(--color-danger))",
            }}
          />
        </button>

        {/* Profile / Logout */}
        <div className="pl-4 border-l border-white/[0.05]">
          <UserNav userEmail="admin@issuehub.com" userName="Super Admin" />
        </div>
      </div>
    </header>
  );
}
