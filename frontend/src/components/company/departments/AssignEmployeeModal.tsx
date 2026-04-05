"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { getEmployees } from "@/services/company/employee-management.service";
import { addEmployeeToDepartmentAction } from "@/actions/company/departments/department.actions";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { toast } from "sonner";
import { Search, UserPlus, Loader2, Check, Info, Users } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AssignEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentName: string;
  onSuccess: () => void;
  existingMemberIds: string[];
}

export const AssignEmployeeModal = ({
  isOpen,
  onClose,
  departmentId,
  departmentName,
  onSuccess,
  existingMemberIds,
}: AssignEmployeeModalProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (employeeId: string) => {
    try {
      setAssigningId(employeeId);
      await addEmployeeToDepartmentAction(departmentId, employeeId);
      toast.success("Employee assigned successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to assign employee");
    } finally {
      setAssigningId(null);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Assign Personnel"
      description={`Add a new member to the ${departmentName} department.`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-7 py-2">
        {/* --- SEARCH SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Directory Search
            </span>
          </div>

          <div className="relative group">
            <Search 
              size={16} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors duration-300" 
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full pl-11 pr-4 h-11 text-sm transition-all duration-300",
                "bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white",
                "placeholder:text-slate-600 focus:border-accent/40"
              )}
            />
          </div>
        </div>

        {/* --- PERSONNEL LIST SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Available Personnel
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden max-h-[350px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-4 opacity-60">
                <Loader2 className="animate-spin text-accent" size={28} strokeWidth={2} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Accessing Records...
                </span>
              </div>
            ) : filteredEmployees.length > 0 ? (
              <div className="divide-y divide-white/5">
                {filteredEmployees.map((emp) => {
                  const isAlreadyMember = existingMemberIds.includes(emp.id);

                  return (
                    <div
                      key={emp.id}
                      className={cn(
                        "flex items-center gap-4 p-4 transition-all duration-300",
                        isAlreadyMember
                          ? "opacity-50 grayscale bg-transparent"
                          : "hover:bg-white/[0.04]"
                      )}
                    >
                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm overflow-hidden shrink-0">
                        <Image
                          src={
                            emp.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              emp.name
                            )}&background=random`
                          }
                          alt={emp.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          onError={(e: any) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              emp.name
                            )}`;
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-bold text-white truncate">
                          {emp.name}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate mt-0.5">
                          {emp.role || "Employee"}
                        </span>
                      </div>

                      {/* Action */}
                      {isAlreadyMember ? (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[9px] font-black uppercase tracking-widest shrink-0">
                          <Check size={12} strokeWidth={2.5} className="text-green-400" />
                          Assigned
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAssign(emp.id)}
                          disabled={assigningId === emp.id}
                          className={cn(
                            "h-9 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shrink-0",
                            "bg-accent/10 text-accent hover:bg-accent hover:text-[#08090a] border border-accent/20 hover:shadow-lg hover:shadow-accent/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                          )}
                        >
                          {assigningId === emp.id ? (
                            <Loader2 className="animate-spin" size={14} strokeWidth={3} />
                          ) : (
                            <>
                              <UserPlus size={14} strokeWidth={2.5} />
                              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">Add</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center opacity-60">
                <Users size={24} className="text-slate-500 mb-3" />
                <p className="text-[11px] font-medium text-slate-400">
                  No matching personnel found in directory.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Instant Assignment
            </span>
          </div>

          <div className="flex items-center justify-end w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              className="h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all flex items-center gap-2"
            >
              Finished
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};