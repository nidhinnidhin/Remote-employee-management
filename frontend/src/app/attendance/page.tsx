"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import { getMyLogs } from "@/services/employee/attendance/attendance.service";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { AttendanceFilters } from "@/components/employees/attendance/AttendanceFilters";
import { AttendanceTable } from "@/components/employees/attendance/AttendanceTable";
import { AttendanceDetailsModal } from "@/components/employees/attendance/AttendanceDetailsModal";
import { toast } from "sonner";

export default function EmployeeAttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getMyLogs({
        page,
        limit,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: status || undefined,
        search: search || undefined,
      });
      setLogs(res.data);
      setTotal(res.total);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load historical attendance logs.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, status, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatus("");
    setSearch("");
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full min-h-screen animate-in fade-in duration-700 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              Attendance Chronicles
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{total} Historical Records</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Page {page} of {totalPages || 1}</span>
            </div>
          </div>
        </div>

        {/* Date & Status Filters */}
        <AttendanceFilters
          startDate={startDate}
          endDate={endDate}
          status={status}
          search={search}
          onStartDateChange={(val) => {
            setStartDate(val);
            setPage(1);
          }}
          onEndDateChange={(val) => {
            setEndDate(val);
            setPage(1);
          }}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onClearFilters={handleClearFilters}
          onRefresh={fetchLogs}
        />

        {/* Logs Table and Pagination */}
        <AttendanceTable
          logs={logs}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSelectLog={setSelectedLog}
        />
      </div>

      {/* Swipe Activity Logs Modal overlay */}
      <AttendanceDetailsModal
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </DashboardLayout>
  );
}
