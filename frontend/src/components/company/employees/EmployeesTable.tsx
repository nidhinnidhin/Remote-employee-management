"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/ui/Table";
import { Column } from "@/shared/types/ui/table-props.type";
import Pagination from "@/components/ui/Pagination";
import { MoreVertical, UserX, UserCheck, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { getEmployees, updateEmployeeStatus } from "@/services/company/employee-management.service";
import { toast } from "sonner";
import { EmployeeDetailsModal } from "./EmployeeDetailsModal";
import ActionReasonModal from "@/components/ui/ActionReasonModal";
import { createPortal } from "react-dom";
import { resendInvitationAction } from "@/actions/company/resend-invitation.action";
import { Send } from "lucide-react";

const EmployeesTable = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState<{ employee: Employee; status: string } | null>(null);

  const itemsPerPage = 10;

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
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
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleStatusToggle = (employee: Employee) => {
    const newStatus = employee.isActive ? "SUSPENDED" : "ACTIVE";
    setPendingStatusUpdate({ employee, status: newStatus });
    setIsReasonModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmStatusUpdate = async (reason: string) => {
    if (!pendingStatusUpdate) return;
    try {
      await updateEmployeeStatus(pendingStatusUpdate.employee.id, pendingStatusUpdate.status, reason);
      toast.success(`Employee ${pendingStatusUpdate.status === "SUSPENDED" ? "blocked" : "unblocked"} successfully`);
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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[rgb(var(--color-accent))] flex items-center justify-center text-white font-medium text-sm overflow-hidden border border-white/10">
            {employee.avatar ? (
              <Image
                src={employee.avatar}
                alt={employee.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span>
                {employee.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-primary font-bold tracking-tight">{employee.name}</span>
            <span className="text-muted text-[11px] font-medium">{employee.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Department",
      accessor: (employee) => (
        <span className="text-secondary font-semibold text-[13px]">{employee.department || "N/A"}</span>
      ),
    },
    {
      header: "Role",
      accessor: (employee: Employee) => (
        <span className="chip-vibrant">
          {employee.role}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (employee: Employee) => {
        if (employee.inviteStatus === "PENDING") {
          return (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold border border-amber-200 uppercase tracking-wider">
              Invitation Pending
            </span>
          );
        }
        return (
          <span
            className={employee.isActive ? "status-active" : "status-suspended"}
          >
            {employee.isActive ? "Active" : "Suspended"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: (employee: Employee) => (
        <div className="flex justify-end">
          <button
            onClick={(e) => toggleMenu(e, employee)}
            className="text-primary hover:text-accent transition-all p-2 rounded-xl hover:bg-accent/10 active:scale-90"
          >
            <MoreVertical size={20} />
          </button>

          {openMenuId === employee.id && menuAnchor && createPortal(
            <div
              className="fixed glass-dropdown rounded-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              style={{
                top: `${menuAnchor.y + 8}px`,
                right: `${window.innerWidth - menuAnchor.x}px`,
                minWidth: '200px'
              }}
            >
              <div className="flex flex-col p-1.5">
                <button
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:bg-accent/10 hover:text-accent rounded-lg transition-all font-bold group"
                  onClick={() => handleViewDetails(employee)}
                >
                  <Eye size={16} className="group-hover:scale-110 transition-transform" />
                  <span>View Details</span>
                </button>
                {employee.inviteStatus === "PENDING" && (
                  <button
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 rounded-lg transition-all font-bold group"
                    onClick={() => handleResendInvite(employee)}
                  >
                    <Send size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Resend Invitation</span>
                  </button>
                )}
                <div className="h-px bg-white/5 my-1 mx-2" />
                <button
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all font-bold group ${employee.isActive
                    ? "text-danger hover:bg-danger/10"
                    : "text-success hover:bg-success/10"
                    }`}
                  onClick={() => handleStatusToggle(employee)}
                >
                  {employee.isActive ?
                    <UserX size={16} className="group-hover:scale-110 transition-transform" /> :
                    <UserCheck size={16} className="group-hover:scale-110 transition-transform" />
                  }
                  <span>{employee.isActive ? "Block User" : "Unblock User"}</span>
                </button>
              </div>
            </div>,
            document.body
          )}
        </div>
      ),
      className: "text-right",
    },
  ];

  if (loading && employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <Loader2 className="animate-spin text-accent" size={40} />
        <p className="text-muted font-medium">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {employees.length > 0 ? (
        <>
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
        </>
      ) : (
        <div className="portal-card p-20 text-center space-y-4 border-dashed border-2">
          <p className="text-secondary">No employees found in your company.</p>
          <button className="btn-primary text-sm px-6 py-2">Invite Employee</button>
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
        title={pendingStatusUpdate?.status === "SUSPENDED" ? "Block Employee" : "Unblock Employee"}
        description={`Please provide a reason for ${pendingStatusUpdate?.status === "SUSPENDED" ? "blocking" : "unblocking"} ${pendingStatusUpdate?.employee?.name}. They will receive an email with this content.`}
        actionLabel={pendingStatusUpdate?.status === "SUSPENDED" ? "Block User" : "Unblock User"}
        actionColor={pendingStatusUpdate?.status === "SUSPENDED" ? "danger" : "success"}
      />
    </div>
  );
};

export default EmployeesTable;
