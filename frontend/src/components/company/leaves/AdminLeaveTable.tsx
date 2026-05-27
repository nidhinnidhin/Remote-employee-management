import React from "react";
import { format } from "date-fns";
import { AdminLeaveRequest } from "@/services/company/leave/leave.service";
import { Check, X, FileText, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";

interface AdminLeaveTableProps {
  logs: AdminLeaveRequest[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectLog: (log: AdminLeaveRequest) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider w-fit">
          <CheckCircle2 size={12} />
          <span>Approved</span>
        </div>
      );
    case "REJECTED":
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider w-fit">
          <XCircle size={12} />
          <span>Rejected</span>
        </div>
      );
    case "PENDING":
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider w-fit">
          <Clock size={12} />
          <span>Pending</span>
        </div>
      );
    case "CANCELLED":
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-wider w-fit">
          <X size={12} />
          <span>Cancelled</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[10px] font-bold uppercase tracking-wider w-fit">
          <span>{status}</span>
        </div>
      );
  }
};

export const AdminLeaveTable: React.FC<AdminLeaveTableProps> = ({
  logs,
  loading,
  page,
  totalPages,
  onPageChange,
  onSelectLog,
}) => {
  const columns = [
    {
      header: "Employee",
      accessor: (log: AdminLeaveRequest) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
            {log.employeeId?.avatar ? (
              <img src={log.employeeId.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-slate-400">
                {log.employeeId?.firstName?.[0] || "?"}
                {log.employeeId?.lastName?.[0] || "?"}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-200">
              {log.employeeId?.firstName} {log.employeeId?.lastName}
            </span>
            <span className="text-xs text-slate-500 truncate max-w-[120px]">
              {log.employeeId?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Leave Type",
      accessor: (log: AdminLeaveRequest) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200 capitalize">
            {log.leaveType?.replace(/_/g, " ")}
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            {log.durationType?.replace(/_/g, " ")}
          </span>
        </div>
      ),
    },
    {
      header: "Duration",
      accessor: (log: AdminLeaveRequest) => (
        <div className="flex flex-col">
          <span className="text-sm text-slate-300">
            {format(new Date(log.startDate), "MMM d, yyyy")}
          </span>
          <span className="text-xs text-slate-500">
            to {format(new Date(log.endDate), "MMM d, yyyy")}
          </span>
        </div>
      ),
    },
    {
      header: "Days",
      accessor: (log: AdminLeaveRequest) => (
        <span className="text-sm font-medium text-slate-200">
          {log.totalDays} day{log.totalDays > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (log: AdminLeaveRequest) => getStatusBadge(log.status),
    },
    {
      header: "Actions",
      accessor: (log: AdminLeaveRequest) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectLog(log);
          }}
          className="text-xs font-medium text-accent hover:text-accent/80 transition-colors bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/20 hover:bg-accent/20"
        >
          {log.status === "PENDING" ? "Review" : "View"}
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 min-h-[400px]">
        <Table
          columns={columns}
          data={logs}
          keyExtractor={(log) => log.id}
          isLoading={loading}
          emptyMessage="No leave requests found for the given criteria."
          theme="dark"
        />
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-end pt-4 border-t border-white/[0.06]">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
