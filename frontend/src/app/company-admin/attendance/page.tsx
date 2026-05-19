"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import { getAdminLogs } from "@/services/company/attendance/attendance.service";
import { getEmployees } from "@/services/company/employee-management.service";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { AttendanceStats } from "@/components/company/attendance/AttendanceStats";
import { AdminAttendanceFilters } from "@/components/company/attendance/AdminAttendanceFilters";
import { AdminAttendanceTable } from "@/components/company/attendance/AdminAttendanceTable";
import { AdminAttendanceDetailsModal } from "@/components/company/attendance/AdminAttendanceDetailsModal";
import { toast } from "sonner";

export default function AdminAttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  // Stats
  const [statsTotalHours, setStatsTotalHours] = useState(0);
  const [statsActiveWorking, setStatsActiveWorking] = useState(0);

  // Fetch employees list on mount
  const fetchEmployees = async () => {
    try {
      const list = await getEmployees();
      setEmployees(list);
    } catch (e) {
      console.error("Failed to load employees list", e);
    }
  };

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminLogs({
        page,
        limit,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        employeeId: selectedEmployeeId || undefined,
        search: search || undefined,
        status: status || undefined,
      });
      setLogs(res.data);
      setTotal(res.total);

      // Compute statistics based on matches
      let totalMins = 0;
      let activeCount = 0;
      res.data.forEach((log) => {
        totalMins += log.totalWorkMinutes || 0;
        if (log.status === "WORKING" || log.status === "BREAK") activeCount++;
      });
      setStatsTotalHours(Math.round(totalMins / 60));
      setStatsActiveWorking(activeCount);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load corporate attendance logs.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, selectedEmployeeId, search, status]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedEmployeeId("");
    setSearch("");
    setStatus("");
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col w-full min-h-screen pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">
              Corporate Attendance Control
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{total} Total Logs</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Shift Operations Admin Center</span>
            </div>
          </div>
        </div>

        {/* METRICS DASHBOARD ROW */}
        <AttendanceStats
          totalCount={total}
          totalHours={statsTotalHours}
          activeOperators={statsActiveWorking}
        />

        {/* Date, Employee & Status Filters */}
        <AdminAttendanceFilters
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          search={search}
          startDate={startDate}
          endDate={endDate}
          status={status}
          onEmployeeChange={(id) => {
            setSelectedEmployeeId(id);
            setPage(1);
          }}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
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
          onResetFilters={handleResetFilters}
          onSearchLogs={fetchLogs}
        />

        {/* Corporate Logs Table and Pagination */}
        <AdminAttendanceTable
          logs={logs}
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onSelectLog={setSelectedLog}
        />
      </div>

      {/* TIMELINE OVERLAY MODAL */}
      <AdminAttendanceDetailsModal
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </AdminLayoutWrapper>
  );
}
