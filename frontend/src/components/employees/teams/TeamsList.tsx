"use client";

import React from "react";
import { Department } from "@/shared/types/company/department.types";
import { DepartmentAccordion } from "./DepartmentAccordion";
import { Users2, Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TeamsListProps {
  departments: Department[];
}

export const TeamsList: React.FC<TeamsListProps> = ({ departments }) => {
  // --- EMPTY STATE ---
  if (!departments || departments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[2rem] border border-white/[0.06] bg-white/[0.01] text-center max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-700">
        <div className="w-16 h-16 rounded-2xl bg-accent/[0.08] border border-accent/20 flex items-center justify-center text-accent mb-6 shadow-[0_0_20px_rgba(var(--color-accent),0.1)]">
          <Users2 size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
          No Teams Found
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-xs">
          You haven&apos;t been assigned to any departments or professional
          teams yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* --- HEADER & SEARCH --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Organization Overview
            </span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">
            My Active Teams ({departments.length})
          </h2>
        </div>

        {/* Standard SaaS Search Bar */}
        <div className="relative group w-full md:w-72">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-accent transition-colors duration-300"
            size={16}
          />
          <input
            type="text"
            placeholder="Search departments..."
            className={cn(
              "w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-slate-200 outline-none transition-all",
              "placeholder:text-slate-700 focus:border-accent/40 focus:bg-accent/[0.01]",
            )}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-4"
      >
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="transition-none" // Ensure no card-level hover highlight here to keep it clean
          >
            <DepartmentAccordion department={dept} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};
