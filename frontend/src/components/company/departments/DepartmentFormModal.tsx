"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import { Department } from "@/shared/types/company/departments/department.type";
import {
  createDepartmentAction,
  updateDepartmentAction,
} from "@/actions/company/departments/department.actions";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Building2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onSuccess: () => void;
}

export const DepartmentFormModal = ({
  isOpen,
  onClose,
  department,
  onSuccess,
}: DepartmentFormModalProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name);
    } else {
      setName("");
    }
  }, [department, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      setLoading(true);
      if (department) {
        await updateDepartmentAction(department.id, name.trim());
        toast.success("Department updated successfully");
      } else {
        await createDepartmentAction(name.trim());
        toast.success("Department created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title={department ? "Edit Department" : "Create Department"}
      description={
        department
          ? "Update the configuration for this department."
          : "Define a new organizational unit for your company."
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-7 py-2">
        {/* --- IDENTITY SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Unit Identity
            </span>
          </div>

          <div className="space-y-1.5 relative group">
            <Building2
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors duration-300"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Engineering, Marketing..."
              disabled={loading}
              autoFocus
              className={cn(
                "w-full pl-11 pr-4 h-11 text-sm transition-all duration-300",
                "bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white",
                "placeholder:text-slate-600 focus:border-accent/40 disabled:opacity-50",
              )}
            />
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Organizational Tree
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
            >
              Cancel
            </Button>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 sm:flex-none h-11 px-8 rounded-xl flex items-center justify-center gap-2",
                "transition-all duration-300 active:scale-95",
                "bg-transparent text-white border border-gray-300 font-black text-[10px] uppercase tracking-[0.2em]",
                "hover:bg-white/10 hover:border-white hover:shadow-lg hover:shadow-white/5",
                "disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100",
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : department ? (
                <>
                  <Edit2 size={16} strokeWidth={3} />
                  <span>Update</span>
                </>
              ) : (
                <>
                  <Plus size={16} strokeWidth={3} />
                  <span>Create</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};
