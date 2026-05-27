"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import { getAdminLogs, decideLateRequest } from "@/services/company/attendance/attendance.service";
import { getEmployees } from "@/services/company/employee-management.service";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { AttendanceStats } from "@/components/company/attendance/AttendanceStats";
import { AdminAttendanceFilters } from "@/components/company/attendance/AdminAttendanceFilters";
import { AdminAttendanceTable } from "@/components/company/attendance/AdminAttendanceTable";
import { AdminAttendanceDetailsModal } from "@/components/company/attendance/AdminAttendanceDetailsModal";
import { AdminLeaveTable } from "@/components/company/leaves/AdminLeaveTable";
import { AdminLeaveDetailsModal } from "@/components/company/leaves/AdminLeaveDetailsModal";
import { getAdminLeaveLogsAction, approveLeaveAction, rejectLeaveAction } from "@/actions/company/leave.actions";
import { AdminLeaveRequest } from "@/services/company/leave/leave.service";
import { toast } from "sonner";

export default function AdminAttendancePage() {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  // Leave state
  const [activeTab, setActiveTab] = useState<"attendance" | "leave">("attendance");
  const [leaveLogs, setLeaveLogs] = useState<AdminLeaveRequest[]>([]);
  const [leaveTotal, setLeaveTotal] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState<AdminLeaveRequest | null>(null);

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
      if (activeTab === "attendance") {
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
      } else {
        const res = await getAdminLeaveLogsAction({
          page,
          limit,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          employeeId: selectedEmployeeId || undefined,
          search: search || undefined,
          status: status || undefined,
        });
        if (res.success && res.data) {
          // Handle both paginated format and array directly safely
          if (Array.isArray(res.data)) {
            setLeaveLogs(res.data);
            setLeaveTotal(res.data.length);
          } else if (res.data.data && Array.isArray(res.data.data)) {
            setLeaveLogs(res.data.data);
            setLeaveTotal(res.data.total ?? res.data.data.length);
          } else {
            setLeaveLogs([]);
            setLeaveTotal(0);
          }
        } else {
          toast.error(res.error || "Failed to load leave logs");
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error(`Failed to load corporate ${activeTab} logs.`);
    } finally {
      setLoading(false);
    }
  }, [page, limit, startDate, endDate, selectedEmployeeId, search, status, activeTab]);

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

  // When tab changes, reset page
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleDecideRequest = async (
    attendanceId: string,
    decisionStatus: "APPROVED" | "REJECTED",
    remarks: string
  ) => {
    try {
      await decideLateRequest({
        attendanceId,
        status: decisionStatus,
        adminRemarks: remarks || undefined,
      });
      toast.success(`Successfully ${decisionStatus.toLowerCase()} late clock-in request.`);
      fetchLogs();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to submit decision.");
      throw e;
    }
  };

  const handleDecideLeaveRequest = async (id: string, decisionStatus: "APPROVED" | "REJECTED", remarks: string) => {
    try {
      let res;
      if (decisionStatus === "APPROVED") {
        res = await approveLeaveAction(id, remarks);
      } else {
        res = await rejectLeaveAction(id, remarks);
      }

      if (res.success) {
        toast.success(`Successfully ${decisionStatus.toLowerCase()} leave request.`);
        fetchLogs();
      } else {
        toast.error(res.error || "Failed to process leave request");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("An unexpected error occurred");
    }
  };

  const totalPages = Math.ceil((activeTab === "attendance" ? total : leaveTotal) / limit);

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col w-full min-h-screen pb-12 animate-in fade-in duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/[0.06] pb-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
              Control Center
              {/* Toggle Switch */}
              <div className="flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 text-sm font-medium normal-case tracking-normal">
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-4 py-1.5 rounded-lg transition-all ${
                    activeTab === "attendance" 
                      ? "bg-accent/20 text-accent" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab("leave")}
                  className={`px-4 py-1.5 rounded-lg transition-all ${
                    activeTab === "leave" 
                      ? "bg-accent/20 text-accent" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Leaves
                </button>
              </div>
            </h2>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{activeTab === "attendance" ? total : leaveTotal} Total Logs</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span>Shift Operations Admin Center</span>
            </div>
          </div>
        </div>

        {activeTab === "attendance" && (
          <AttendanceStats
            totalCount={total}
            totalHours={statsTotalHours}
            activeOperators={statsActiveWorking}
          />
        )}

        <AdminAttendanceFilters
          employees={employees}
          selectedEmployeeId={selectedEmployeeId}
          search={search}
          startDate={startDate}
          endDate={endDate}
          status={status}
          mode={activeTab}
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

        {activeTab === "attendance" ? (
          <AdminAttendanceTable
            logs={logs}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onSelectLog={setSelectedLog}
            onDecideRequest={handleDecideRequest}
          />
        ) : (
          <AdminLeaveTable
            logs={leaveLogs}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onSelectLog={setSelectedLeave}
          />
        )}
      </div>

      <AdminAttendanceDetailsModal
        selectedLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />

      <AdminLeaveDetailsModal
        selectedLog={selectedLeave}
        onClose={() => setSelectedLeave(null)}
        onDecideRequest={handleDecideLeaveRequest}
      />
    </AdminLayoutWrapper>
  );
}
