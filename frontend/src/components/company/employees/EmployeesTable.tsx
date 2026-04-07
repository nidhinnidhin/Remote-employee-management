"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { Column } from "@/shared/types/ui/table-props.type";
import Pagination from "@/components/ui/Pagination";
import {
  MoreVertical,
  UserX,
  UserCheck,
  Eye,
  Loader2,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import {
  getEmployees,
  updateEmployeeStatus,
} from "@/services/company/employee-management.service";
import { toast } from "sonner";
import { EmployeeDetailsModal } from "./EmployeeDetailsModal";
import ActionReasonModal from "@/components/ui/ActionReasonModal";
import { createPortal } from "react-dom";
import { resendInvitationAction } from "@/actions/company/resend-invitation.action";
import { cn } from "@/lib/utils";

interface EmployeesTableProps {
  refreshKey?: number;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ refreshKey }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{
    employee: Employee;
    status: string;
  } | null>(null);

  const itemsPerPage = 10;

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      console.log(data)
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [refreshKey]);

  const handleStatusToggle = (employee: Employee) => {
    const newStatus = employee.isActive ? "SUSPENDED" : "ACTIVE";
    setPendingStatusUpdate({ employee, status: newStatus });
    setIsReasonModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmStatusUpdate = async (reason: string) => {
    if (!pendingStatusUpdate) return;
    try {
      await updateEmployeeStatus(
        pendingStatusUpdate.employee.id,
        pendingStatusUpdate.status,
        reason,
      );
      toast.success(
        `Employee ${pendingStatusUpdate.status === "SUSPENDED" ? "blocked" : "unblocked"} successfully`,
      );
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to update status");
      throw error;
    } finally {
      setIsReasonModalOpen(false);
      setPendingStatusUpdate(null);
    }
  };

  const handleResendInvite = async (employee: Employee) => {
    try {
      setOpenMenuId(null);
      const result = await resendInvitationAction(employee.id);
      if (result.success) {
        toast.success("Invitation resent successfully");
      } else {
        toast.error(result.error || "Failed to resend invitation");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
    setOpenMenuId(null);
  };

  const toggleMenu = (e: React.MouseEvent, employee: Employee) => {
    if (openMenuId === employee.id) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuAnchor({ x: rect.right, y: rect.bottom });
      setOpenMenuId(employee.id);
    }
  };

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const paginatedData = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: Column<Employee>[] = [
    {
      header: "Employee",
      accessor: (employee: Employee) => (
        <div className="flex items-center gap-3 text-left py-1">
          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs overflow-hidden border border-slate-200">
            {employee.avatar ? (
              <Image
                src={employee.avatar}
                alt={employee.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="uppercase text-slate-500">
                {employee.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-slate-900 truncate tracking-tight">
              {employee.name}
            </span>
            <span className="text-[11px] text-slate-500 truncate font-normal">
              {employee.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Name",
      accessor: (employee) => (
        <span className="text-slate-600 text-sm font-medium">
          {employee.name || "—"}
        </span>
      ),
    },
    {
      header: "Role",
      accessor: (employee: Employee) => (
        <span className="inline-flex px-3 py-1 rounded-full border border-slate-200 bg-transparent text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          {employee.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (employee: Employee) => {
        if (employee.inviteStatus === "PENDING") {
          return (
            <span className="text-amber-600 text-[11px] font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Pending
            </span>
          );
        }
        return (
          <span
            className={cn(
              "text-[11px] font-bold flex items-center gap-1.5",
              employee.isActive ? "text-emerald-600" : "text-rose-500",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                employee.isActive ? "bg-emerald-500" : "bg-rose-500",
              )}
            />
            {employee.isActive ? "Active" : "Suspended"}
          </span>
        );
      },
    },
    {
      header: "",
      accessor: (employee: Employee) => (
        <div className="flex justify-end pr-2">
          <button
            onClick={(e) => toggleMenu(e, employee)}
            className="text-slate-400  transition-colors p-1.5 rounded-lg "
          >
            <MoreVertical size={18} />
          </button>

          {openMenuId === employee.id &&
            menuAnchor &&
            createPortal(
              <>
                {/* Transparent backdrop to handle closing */}
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setOpenMenuId(null)}
                />

                <div
                  className={cn(
                    "fixed z-[9999] py-2 min-w-[190px] rounded-xl shadow-2xl",
                    "bg-[#1a1c1e] border border-white/5", // Light black background with a very subtle border
                    "animate-in fade-in slide-in-from-top-1 duration-150",
                  )}
                  style={{
                    top: `${menuAnchor.y + 4}px`,
                    right: `${window.innerWidth - menuAnchor.x}px`,
                  }}
                >
                  <div className="flex flex-col">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/[0.05] transition-colors font-medium text-left"
                      onClick={() => handleViewDetails(employee)}
                    >
                      <Eye
                        size={16}
                        className="text-slate-400 group-hover:text-white"
                      />
                      View Details
                    </button>

                    {employee.inviteStatus === "PENDING" && (
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/[0.05] transition-colors font-medium text-left"
                        onClick={() => handleResendInvite(employee)}
                      >
                        <Send
                          size={16}
                          className="text-slate-400 group-hover:text-white"
                        />
                        Resend Invitation
                      </button>
                    )}

                    {/* Subtle divider for dark theme */}
                    <div className="h-px bg-white/5 my-1.5 mx-2" />

                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left",
                        employee.isActive
                          ? "text-red-400 hover:bg-red-500/10"
                          : "text-emerald-400 hover:bg-emerald-500/10",
                      )}
                      onClick={() => handleStatusToggle(employee)}
                    >
                      {employee.isActive ? (
                        <UserX size={16} />
                      ) : (
                        <UserCheck size={16} />
                      )}
                      {employee.isActive ? "Block User" : "Unblock User"}
                    </button>
                  </div>
                </div>
              </>,
              document.body,
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {employees.length > 0 ? (
        <div className="space-y-4">
          <Table
            data={paginatedData}
            columns={columns}
            keyExtractor={(item) => item.id}
            theme="light"
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-24 text-center border border-dashed border-slate-200 rounded-2xl bg-[#0B1026]">
          <p className="text-slate-500 font-medium mb-4">No employees found.</p>
        </div>
      )}

      {/* Details Modal */}
      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        employee={selectedEmployee}
      />

      {/* Action Reason Modal */}
      <ActionReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => {
          setIsReasonModalOpen(false);
          setPendingStatusUpdate(null);
        }}
        onConfirm={handleConfirmStatusUpdate}
        title={
          pendingStatusUpdate?.status === "SUSPENDED"
            ? "Block Employee"
            : "Unblock Employee"
        }
        description={`Set access for ${pendingStatusUpdate?.employee?.name}. User will be notified.`}
        actionLabel={
          pendingStatusUpdate?.status === "SUSPENDED"
            ? "Block User"
            : "Unblock User"
        }
        actionColor={
          pendingStatusUpdate?.status === "SUSPENDED" ? "danger" : "success"
        }
      />
    </div>
  );
};

export default EmployeesTable;
