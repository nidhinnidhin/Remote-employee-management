"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LeaveBalanceCards } from "./LeaveBalanceCards";
import { LeaveLogTable } from "./LeaveLogTable";
import { ApplyLeaveModal } from "./ApplyLeaveModal";
import Button from "@/components/ui/Button";
import { Plus, CalendarOff } from "lucide-react";
import { LeaveBalance, LeaveRequest, LeaveStatus } from "@/types/leave.types";
import { CompanyPolicy } from "@/shared/types/company/policy/policy.type";
import {
  getMyLeavesAction,
  getMyLeaveBalanceAction,
  cancelLeaveAction,
} from "@/actions/employee/leave.actions";
import { toast } from "sonner";
import { getCompanyPolicies } from "@/services/employee/policy/company-policy.service";

export const LeaveDashboard: React.FC = () => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);

  const [logs, setLogs] = useState<LeaveRequest[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const [availableLeaveTypes, setAvailableLeaveTypes] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "">("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });

  const fetchBalances = async () => {
    setLoadingBalances(true);
    const res = await getMyLeaveBalanceAction();
    console.log(res);
    if (res.success && res.data) {
      setBalances(res.data);
    } else {
      toast.error(res.error ?? "Failed to load leave balances");
    }
    setLoadingBalances(false);
  };

  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    const res = await getMyLeavesAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "" ? statusFilter : undefined,
      startDate: dateFilter.startDate || undefined,
      endDate: dateFilter.endDate || undefined,
    });

    if (res.success && res.data) {
      setLogs(res.data.data);
      setTotalLogs(res.data.total);
    } else {
      toast.error(res.error ?? "Failed to load leave history");
    }
    setLoadingLogs(false);
  }, [currentPage, statusFilter, dateFilter]);

  const fetchLeaveTypes = async () => {
    try {
      const policies: CompanyPolicy[] = await getCompanyPolicies();
      const leavePolicy = policies.find(
        (p) => p.type?.toLowerCase() === "leave" && p.isActive && p.leaveDistribution
      );
      if (leavePolicy?.leaveDistribution) {
        setAvailableLeaveTypes(
          leavePolicy.leaveDistribution.map((dist) => dist.type)
        );
      }
    } catch {
      // Gracefully handle policy fetching errors
    }
  };

  useEffect(() => {
    fetchBalances();
    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleCancelLeave = async (id: string) => {
    const res = await cancelLeaveAction(id);
    
    if (res.success) {
      toast.success("Leave cancelled successfully");
      fetchLogs();
      fetchBalances();
    } else {
      toast.error(res.error ?? "Failed to cancel leave");
    }
  };

  const handleApplySuccess = () => {
    fetchLogs();
    fetchBalances();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[rgb(var(--color-accent-subtle))]">
            <CalendarOff className="w-5 h-5 text-[rgb(var(--color-accent))]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Leave Management</h1>
            <p className="text-muted text-sm mt-0.5">
              Track your leave balance and apply for time off
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsApplyModalOpen(true)}
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Apply for Leave
          </span>
        </Button>
      </div>

      {/* Balance Cards */}
      {!loadingBalances && <LeaveBalanceCards balances={balances} />}
      {loadingBalances && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[rgb(var(--color-nav-bg))] p-6 rounded-2xl border border-[rgb(var(--color-border-subtle))] animate-pulse h-36"
            />
          ))}
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-[rgb(var(--color-nav-bg))] rounded-2xl border border-[rgb(var(--color-border-subtle))] shadow-sm p-6">
        <h2 className="text-base font-semibold text-primary mb-6">
          Leave History
        </h2>

        <LeaveLogTable
          logs={logs}
          total={totalLogs}
          loading={loadingLogs}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onCancel={handleCancelLeave}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={handleApplySuccess}
        availableLeaveTypes={availableLeaveTypes}
        balances={balances}
      />
    </div>
  );
};