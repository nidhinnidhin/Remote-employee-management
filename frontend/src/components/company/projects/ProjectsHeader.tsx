"use client";

import { Plus, Search, Briefcase } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectsHeaderProps {
  onAdd: () => void;
  onSearch: (query: string) => void;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({ onAdd, onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  return (
    <div className="portal-card p-8 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.06] relative overflow-hidden transition-none">
      {/* Subtle Accent Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/20 flex items-center justify-center text-accent shrink-0 shadow-[0_0_20px_rgba(var(--color-accent),0.1)]">
            <Briefcase size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">
              Project Portfolio
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Centralized command for company initiatives and resource tracking.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            onClick={onAdd}
            className={cn(
              "group relative flex items-center gap-2.5 px-7 py-3 rounded-xl overflow-hidden shrink-0 transition-all duration-300 w-full sm:w-auto justify-center",
              "bg-accent text-white border border-white/20",
              "text-[10px] font-black uppercase tracking-[0.25em] antialiased",
              "hover:brightness-110",
              "hover:shadow-[0_0_25px_rgba(var(--color-accent),0.4),inset_0_0_10px_rgba(255,255,255,0.2)]",
              "active:scale-95 shadow-xl shadow-accent/10",
            )}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            <Plus
              size={14}
              strokeWidth={4}
              className="relative z-10 transition-transform duration-500 group-hover:rotate-90 text-white"
            />
            <span className="relative z-10 text-white">Create Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsHeader;
