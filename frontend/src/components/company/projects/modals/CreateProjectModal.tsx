"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { CreateProjectPayload } from "@/shared/types/company/projects/project.type";
import { createProjectAction } from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { Calendar, Info, Layout, Plus, FileText, AlertCircle, Search, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmployees } from "@/services/company/employee-management.service";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateProjectPayload>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "Active",
    members: [],
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", description: "", startDate: "", endDate: "", status: "Active", members: [] });
      setErrors({});
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      // Only show active employees
      const activeEmployees = (data || []).filter(emp => emp.isActive);
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  /**
   * FIXED: Use a simplified event type that works for both standard inputs 
   * and your custom FormDropdown/FormInput components.
   */
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleEmployee = (employeeId: string) => {
    setFormData((prev) => {
      const currentMembers = prev.members || [];
      const isSelected = currentMembers.includes(employeeId);
      const newMembers = isSelected
        ? currentMembers.filter((id) => id !== employeeId)
        : [...currentMembers, employeeId];
      return { ...prev, members: newMembers };
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!formData.name?.trim()) {
      validationErrors.name = "Project name is required";
    } else if (formData.name.trim().length < 3) {
      validationErrors.name = "Project name must be at least 3 characters long";
    }

    if (!formData.description?.trim()) {
      validationErrors.description = "Project description is required";
    }

    if (!formData.startDate) {
      validationErrors.startDate = "Start date is required";
    } else {
      const [year, month, day] = formData.startDate.split("-").map(Number);
      const start = new Date(year, month - 1, day);
      if (start < today) {
        validationErrors.startDate = "Start date cannot be in the past";
      }
    }

    if (!formData.endDate) {
      validationErrors.endDate = "End date is required";
    } else {
      const [year, month, day] = formData.endDate.split("-").map(Number);
      const end = new Date(year, month - 1, day);
      if (end < today) {
        validationErrors.endDate = "End date cannot be in the past";
      }
    }

    if (formData.startDate && formData.endDate) {
      const [sYear, sMonth, sDay] = formData.startDate.split("-").map(Number);
      const [eYear, eMonth, eDay] = formData.endDate.split("-").map(Number);
      const start = new Date(sYear, sMonth - 1, sDay);
      const end = new Date(eYear, eMonth - 1, eDay);
      if (start > end) {
        validationErrors.endDate = "End date cannot be earlier than start date";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    // Sanitize payload: convert empty strings to undefined for optional backend fields
    const payload = {
      ...formData,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      description: formData.description || undefined,
      members: formData.members?.length ? formData.members : undefined,
    };

    const result = await createProjectAction(payload);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.PROJECT_CREATED);
      onSuccess();
      onClose();
    } else {
      /**
       * FIXED: Type casting 'result as any' or narrowing the type 
       * to access the custom 'errors' property.
       */
      const actionResult = result as { success: boolean; errors?: Record<string, string>; error?: string };
      
      if (actionResult.errors && Object.keys(actionResult.errors).length > 0) {
        setErrors(actionResult.errors);
      } else if (actionResult.error) {
        toast.error(actionResult.error);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Create New Project"
      description="Initialize a new project workspace and define its core parameters."
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-7">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Identity & Scope
                </span>
              </div>

              <FormInput
                label="Project Name"
                name="name"
                value={formData.name ?? ""}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g. Q2 Global Expansion"
                icon={<Layout size={16} strokeWidth={1.5} />}
                required
              />

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Objectives & Description <span className="text-accent">*</span>
                </label>
                <div className="relative group">
                  <FileText
                    size={16}
                    className={cn(
                      "absolute left-3.5 top-3.5 transition-colors duration-300",
                      errors.description ? "text-red-400" : "text-slate-500 group-focus-within:text-accent"
                    )}
                  />
                  <textarea
                    name="description"
                    value={formData.description ?? ""}
                    onChange={handleChange}
                    placeholder="Outline the mission-critical goals..."
                    className={cn(
                      "field-input w-full pl-11 pr-4 py-3 text-sm transition-all duration-300",
                      "bg-white/[0.02] border rounded-xl min-h-[100px] outline-none text-white resize-none",
                      "placeholder:text-slate-700 focus:bg-accent/[0.01] group-focus-within:border-accent/40",
                      errors.description 
                        ? "border-red-500/50 focus:border-red-500" 
                        : "border-white/10"
                    )}
                  />
                </div>
                {errors.description && (
                  <div className="flex items-center gap-2 px-1 mt-1 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={12} className="text-red-400" />
                    <p className="text-[11px] font-medium text-red-400">{errors.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/[0.04]">
              <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Lifecycle State
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate ?? ""}
                  onChange={handleChange}
                  error={errors.startDate}
                  icon={<Calendar size={16} strokeWidth={1.5} />}
                  required
                />
                <FormInput
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate ?? ""}
                  onChange={handleChange}
                  error={errors.endDate}
                  icon={<Calendar size={16} strokeWidth={1.5} />}
                  required
                />
              </div>

              <FormDropdown
                label="Operational Status"
                name="status"
                value={formData.status ?? "Active"}
                onChange={handleChange}
                error={errors.status}
                options={["Active", "On Hold", "Completed"]}
                required
                variant="accent"
              />
            </div>
          </div>

          <div className="space-y-4 border-l border-white/[0.04] pl-10">
            <div className="flex items-center justify-between px-1 border-l-2 border-accent/30 pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Assign Team Members
              </span>
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                {formData.members?.length || 0} Selected
              </span>
            </div>

            <div className="relative group">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="field-input w-full pl-10 pr-4 py-2 text-xs bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white focus:border-accent/40 transition-all"
              />
            </div>

            <div className="h-[350px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => {
                  const employeeId = emp.id || (emp as any)._id;
                  const isSelected = formData.members?.includes(employeeId);
                  const initials = emp.name
                    ? emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                    : '??';
                  return (
                    <button
                      key={employeeId}
                      type="button"
                      onClick={() => toggleEmployee(employeeId)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 group",
                        isSelected 
                          ? "bg-accent/10 border border-accent/20" 
                          : "hover:bg-white/[0.03] border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-tighter transition-all",
                          isSelected ? "bg-accent text-[#08090a]" : "bg-white/5 text-slate-400 group-hover:bg-white/10"
                        )}>
                          {initials}
                        </div>
                        <div className="text-left">
                          <p className={cn(
                            "text-[11px] font-bold transition-colors",
                            isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                          )}>
                            {emp.name}
                          </p>
                          <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tight">
                            {emp.role || "Employee"}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-accent" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                  <Users size={24} strokeWidth={1} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No candidates found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Validation Active
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
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 sm:flex-none h-11 px-10 rounded-xl transition-all duration-300",
                "bg-accent text-[#08090a] font-black text-[10px] uppercase tracking-[0.2em]",
                "shadow-lg shadow-accent/10 hover:shadow-accent/30 flex items-center justify-center gap-2",
              )}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#08090a]/20 border-t-[#08090a] rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={16} strokeWidth={3} />
                  <span>Create Project</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateProjectModal;