import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { getEmployees } from "@/services/company/employee-management.service";
import { addEmployeeToDepartmentAction } from "@/actions/company/departments/department.actions";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { toast } from "sonner";
import { Search, UserPlus, Loader2, Check } from "lucide-react";
import Image from "next/image";

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
      title="Assign Employee"
      description={`Add a new member to the ${departmentName} department.`}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-primary placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:border-white/20"
          />
        </div>

        {/* Employee List */}
        <div className="portal-card bg-white/[0.02] border-white/5 divide-y divide-white/5 max-h-[400px] overflow-y-auto scrollbar-thin">
          {loading ? (
            <div className="p-10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-accent" size={24} />
              <span className="text-xs text-muted font-medium">
                Loading professionals...
              </span>
            </div>
          ) : filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => {
              const isAlreadyMember = existingMemberIds.includes(emp.id);

              return (
                <div
                  key={emp.id}
                  className={`flex items-center gap-4 p-4 transition-all ${
                    isAlreadyMember
                      ? "opacity-50 grayscale"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-black/20 shrink-0 bg-white/5 flex items-center justify-center">
                    <Image
                      src={
                        emp.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`
                      }
                      alt={emp.name}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}`;
                      }}
                    />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[13px] font-bold text-primary truncate leading-none mb-1">
                      {emp.name}
                    </span>
                    <span className="text-[11px] text-muted truncate opacity-60">
                      {emp.role || "Employee"}
                    </span>
                  </div>

                  {isAlreadyMember ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-muted uppercase tracking-wider border border-white/5">
                      <Check size={10} />
                      Member
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAssign(emp.id)}
                      disabled={assigningId === emp.id}
                      className="p-2 rounded-xl bg-accent/10 hover:bg-accent text-accent hover:text-white transition-all active:scale-90 border border-accent/20 flex items-center justify-center"
                    >
                      {assigningId === emp.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <UserPlus size={16} />
                      )}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-muted font-medium italic">
                No matching employees found.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-primary text-sm font-bold rounded-xl transition-all border border-white/10 active:scale-95"
          >
            Finished
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
