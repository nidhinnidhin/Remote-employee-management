"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ActivityLog } from "@/shared/types/activity-log.type";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Activity,
  FileText,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityLogsViewProps {
  title: string;
  description: string;
  fetchLogsAction: () => Promise<{ success: boolean; data?: ActivityLog[]; error?: string }>;
}

export function ActivityLogsView({ title, description, fetchLogsAction }: ActivityLogsViewProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchLogsAction();
    if (result.success && result.data) {
      setLogs(result.data);
    } else {
      setError(result.error || "Failed to load activity logs.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  // Filter logs based on search query (action or details)
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const query = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(query))
    );
  }, [logs, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  // Handle page change safely
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "DELETE":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "LOGIN":
      case "LOGOUT":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Activity className="text-indigo-500" size={24} />
            {title}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#0a0b0c] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
          </div>
          <button
            onClick={loadLogs}
            disabled={loading}
            className="p-2 rounded-xl bg-[#0a0b0c] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCcw size={16} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#0a0b0c]/50 backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Loading activity logs...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Error Loading Logs</h3>
            <p className="text-slate-400 max-w-md">{error}</p>
            <button
              onClick={loadLogs}
              className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <FileText className="text-slate-500" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No activity logs found</h3>
            <p className="text-slate-400 max-w-md">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Activity logs will appear here once actions are performed in the system."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 w-[160px]">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 w-[120px]">
                      Action
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Details
                    </th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-500 w-[140px] hidden md:table-cell">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {currentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-300">
                          {new Date(log.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase border",
                            getActionColor(log.action)
                          )}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300 font-medium">
                          {log.details}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="text-xs text-slate-500 font-mono">
                          {log.ipAddress || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Showing{" "}
                  <span className="text-white">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-white">
                    {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
                  </span>{" "}
                  of <span className="text-white">{filteredLogs.length}</span>{" "}
                  entries
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-[#08090a] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="px-4 text-sm font-medium text-slate-300">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-[#08090a] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-50 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
