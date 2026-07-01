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
        <div className="pl-4 border-l border-white/[0.05]">
          <UserNav userEmail="admin@issuehub.com" userName="Super Admin" theme="theme-super" />
        </div>
      </div>
    </header>
  );
}
