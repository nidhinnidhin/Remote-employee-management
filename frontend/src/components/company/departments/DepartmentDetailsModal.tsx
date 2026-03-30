import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Department } from "@/shared/types/company/departments/department.type";
import { Users, Info, Calendar } from "lucide-react";
import Image from "next/image";

interface DepartmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export const DepartmentDetailsModal = ({
  isOpen,
  onClose,
  department,
}: DepartmentDetailsModalProps) => {
  if (!department) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Department Details"
      description="View detailed information about this department and its members."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-8">
        {/* Basic Info Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="portal-card p-4 bg-white/5 border-white/5 flex flex-col items-center text-center">
            <Users className="text-accent mb-2" size={24} />
            <span className="text-2xl font-black text-primary">
              {department.employeeIds?.length || 0}
            </span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
              Total Members
            </span>
          </div>
          <div className="portal-card p-4 bg-white/5 border-white/5 flex flex-col items-center text-center">
            <Calendar className="text-accent mb-2" size={24} />
            <span className="text-sm font-bold text-primary">
              {new Date(department.createdAt).toLocaleDateString()}
            </span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
              Created On
            </span>
          </div>
        </div>

        {/* Member List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Info size={16} className="text-accent" />
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
              Department Members
            </h3>
          </div>

          <div className="portal-card bg-white/[0.02] border-white/5 divide-y divide-white/5 max-h-[300px] overflow-y-auto">
            {department.employeeIds && department.employeeIds.length > 0 ? (
              department.employeeIds.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-black/20">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-primary truncate">
                      {member.name}
                    </span>
                    <span className="text-[11px] text-muted truncate opacity-60">
                      {member.email}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-sm text-muted">
                No members found in this department.
              </div>
            )}
          </div>
        </div>

        {/* Footer info/actions could go here */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-primary text-sm font-bold rounded-xl transition-all border border-white/10"
          >
            Close Window
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
