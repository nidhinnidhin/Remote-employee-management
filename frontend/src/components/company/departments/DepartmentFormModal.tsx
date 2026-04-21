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
import { Plus, Edit2, Building2, Info, AlertCircle } from "lucide-react";
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
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(department?.name || "");
      setFieldError(null);
    }
  }, [department, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    const trimmedName = name.trim();

    // 1. Client-side validation (Prevents 400 errors for single characters)
    if (!trimmedName) {
      setFieldError("Department name is required");
      return;
    }

    if (trimmedName.length < 2) {
      setFieldError("Name is too short (minimum 2 characters)");
      return;
    }

    try {
      setLoading(true);

      if (department) {
        await updateDepartmentAction(department.id, trimmedName);
        toast.success("Department updated successfully");
      } else {
        await createDepartmentAction(trimmedName);
        toast.success("Department created successfully");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      // 2. Server-side validation catch (Shows backend errors like 'Name already exists')
      setFieldError(error.message);
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
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Unit Identity
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="relative group">
              <Building2
                size={16}
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
                  fieldError
                    ? "text-red-400"
                    : "text-slate-500 group-focus-within:text-accent",
                )}
              />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldError) setFieldError(null);
                }}
                placeholder="e.g. Engineering, Marketing..."
                disabled={loading}
                autoFocus
                className={cn(
                  "w-full pl-11 pr-4 h-11 text-sm transition-all duration-300",
                  "bg-white/[0.02] border rounded-xl outline-none text-white",
                  "placeholder:text-slate-600 disabled:opacity-50",
                  fieldError
                    ? "border-red-500/50 focus:border-red-500 bg-red-500/5"
                    : "border-white/10 focus:border-accent/40",
                )}
              />
            </div>

            {/* ERROR MESSAGE DISPLAY */}
            {fieldError && (
              <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} className="text-red-400" />
                <p className="text-xs font-medium text-red-400">{fieldError}</p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} />
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
                "disabled:opacity-30 disabled:cursor-not-allowed",
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {department ? (
                    <Edit2 size={16} strokeWidth={3} />
                  ) : (
                    <Plus size={16} strokeWidth={3} />
                  )}
                  <span>{department ? "Update" : "Create"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};
