"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Department } from "@/shared/types/company/department.types";
import { DepartmentAccordion } from "./DepartmentAccordion";
import { Users2, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { searchDepartmentsAction } from "@/actions/company/departments/department.actions";
import Pagination from "@/components/ui/Pagination";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/debounce/useDebounce";

interface TeamsListProps {
  userId: string;
}

export const TeamsList: React.FC<TeamsListProps> = ({ userId }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const itemsPerPage = 5;

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchDepartmentsAction({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        employeeId: userId || undefined,
      });

      if (result && result.data) {
        setDepartments((result.data as any) || []);
        setTotalDepartments(result.total || 0);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load teams");
    } finally {
      setLoading(false);
    }
  }, [userId, currentPage, debouncedSearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  if (!loading && departments.length === 0 && !searchQuery) {
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
            My Portfolio ({totalDepartments})
          </h2>
        </div>

        <div className="relative group w-full md:w-72">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-accent transition-colors duration-300"
            size={16}
          />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-slate-200 outline-none transition-all",
              "placeholder:text-slate-700 focus:border-accent/40 focus:bg-accent/[0.01]",
            )}
          />
          {loading && (
            <div className="absolute inset-y-0 right-3.5 flex items-center">
              <Loader2 className="animate-spin text-accent" size={16} />
            </div>
          )}
        </div>
      </div>

      {loading && departments.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-white/[0.01] border border-white/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.01] rounded-[2rem] border border-dashed border-white/[0.06]">
          <p className="text-slate-500 text-sm">
            No departments match your search query.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-accent text-xs font-black uppercase tracking-widest hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4"
        >
          {departments.map((dept) => (
            <div key={dept.id}>
              <DepartmentAccordion department={dept} />
            </div>
          ))}

          <div className="pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalDepartments / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
