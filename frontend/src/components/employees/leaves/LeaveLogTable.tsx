"use client";

import React, { useState } from "react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import { LeaveRequest, LeaveStatus } from "@/types/leave.types";
import { format } from "date-fns";
import { Search } from "lucide-react";
import Button from "@/components/ui/Button";

interface LeaveLogTableProps {
  logs: LeaveRequest[];
  total: number;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onCancel: (id: string) => void;
  statusFilter: LeaveStatus | "";
  onStatusFilterChange: (status: LeaveStatus | "") => void;
  dateFilter: { startDate: string; endDate: string };
  onDateFilterChange: (dates: { startDate: string; endDate: string }) => void;
}

const PAGE_LIMIT = 10;

export const LeaveLogTable: React.FC<LeaveLogTableProps> = ({
  logs,
  total,
  loading,
  currentPage,
  onPageChange,
  onCancel,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    await onCancel(id);
    setCancellingId(null);
  };

  const getStatusBadge = (status: LeaveStatus) => {
    const badgeMap: Record<LeaveStatus, string> = {
      [LeaveStatus.APPROVED]: "bg-emerald-100 text-emerald-700 border-emerald-200",
      [LeaveStatus.PENDING]: "bg-amber-100 text-amber-700 border-amber-200",
      [LeaveStatus.REJECTED]: "bg-red-100 text-red-700 border-red-200",
      [LeaveStatus.CANCELLED]: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
        <div className="flex flex-col gap-1 items-start">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${badgeMap[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </span>
        </div>
      );
  };

  const columns = [
    {
      header: "Leave Type",
      accessor: (row: LeaveRequest) => (
        <span className="font-medium capitalize">
          {row.leaveType.replace(/_/g, " ").toLowerCase()}
        </span>
      ),
    },
    {
      header: "Duration",
      accessor: (row: LeaveRequest) => (
        <div className="flex flex-col gap-0.5">
          <span>
            {format(new Date(row.startDate), "MMM dd, yyyy")} –{" "}
            {format(new Date(row.endDate), "MMM dd, yyyy")}
          </span>
          <span className="text-xs opacity-60">
            {row.totalDays} Day(s) · {row.durationType.replace(/_/g, " ")}
          </span>
        </div>
      ),
    },
    {
      header: "Reason",
      accessor: (row: LeaveRequest) => (
        <span className="block max-w-[200px] truncate" title={row.reason}>
          {row.reason}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: LeaveRequest) => (
        <div className="flex flex-col gap-1.5 items-start">
          {getStatusBadge(row.status)}
          {row.adminMessage && (
            <div className="text-[10px] text-slate-500 italic max-w-[150px] truncate" title={row.adminMessage}>
              <span className="font-semibold not-italic text-slate-400">Admin: </span>{row.adminMessage}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      accessor: (row: LeaveRequest) =>
        row.status === LeaveStatus.PENDING ? (
          <Button
            variant="outline"
            onClick={() => handleCancel(row.id)}
            isLoading={cancellingId === row.id}
            className="!px-3 !py-1.5 text-xs"
          >
            Cancel
          </Button>
        ) : (
          <span className="text-xs opacity-40">—</span>
        ),
    },
  ];

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <select
            className="px-4 py-2.5 bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/20 focus:border-[rgb(var(--color-accent))] transition-all text-secondary"
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as LeaveStatus | "")
            }
          >
            <option value="">All Statuses</option>
            <option value={LeaveStatus.PENDING}>Pending</option>
            <option value={LeaveStatus.APPROVED}>Approved</option>
            <option value={LeaveStatus.REJECTED}>Rejected</option>
            <option value={LeaveStatus.CANCELLED}>Cancelled</option>
          </select>

          <input
            type="date"
            className="px-4 py-2.5 bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/20 focus:border-[rgb(var(--color-accent))] transition-all text-secondary"
            value={dateFilter.startDate}
            onChange={(e) =>
              onDateFilterChange({ ...dateFilter, startDate: e.target.value })
            }
          />
          <span className="text-muted text-sm">to</span>
          <input
            type="date"
            className="px-4 py-2.5 bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/20 focus:border-[rgb(var(--color-accent))] transition-all text-secondary"
            value={dateFilter.endDate}
            onChange={(e) =>
              onDateFilterChange({ ...dateFilter, endDate: e.target.value })
            }
          />
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reason..."
            className="w-full pl-9 pr-4 py-2.5 bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-accent))]/20 focus:border-[rgb(var(--color-accent))] transition-all text-secondary placeholder:text-muted"
          />
        </div>
      </div>

      <Table
        data={logs}
        columns={columns}
        keyExtractor={(row) => row.id}
        isLoading={loading}
        emptyMessage="No leave requests found."
        theme="dark"
      />

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            theme="dark"
          />
        </div>
      )}
    </div>
  );
};
