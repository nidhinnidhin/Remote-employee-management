"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  AlignLeft,
  Clock,
  Calendar,
  User,
  Plus,
  Info,
  Target,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import {
  TaskStatus,
  CreateTaskPayload,
} from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { createTaskAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { cn } from "@/lib/utils";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  storyId: string;
  employees: Employee[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  storyId,
  employees,
}) => {
  const [formData, setFormData] = useState<
    Omit<CreateTaskPayload, "projectId" | "storyId">
  >({
    title: "",
    description: "",
    status: TaskStatus.TODO,
    estimatedHours: 0,
    assignedTo: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const statusOptions = ["Todo", "In Progress", "Done"];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (!formData.description.trim()) newErrors.description = "Task description is required";
    if (!formData.assignedTo) newErrors.assignedTo = "Assignee is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (formData.estimatedHours === undefined || formData.estimatedHours <= 0) {
      newErrors.estimatedHours = "Estimated hours must be greater than 0";
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = formData.dueDate.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day);
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload: CreateTaskPayload = {
      projectId,
      storyId,
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status as TaskStatus,
      estimatedHours: Number(formData.estimatedHours),
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
    };

    const result = await createTaskAction(payload);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.TASK_CREATED);
      onSuccess();
      handleClose();
    } else {
      toast.error(result.error || "Failed to create task");
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: TaskStatus.TODO,
      estimatedHours: 0,
      assignedTo: "",
      dueDate: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      theme="theme-company"
      title="Create New Task"
      description="Define a specific unit of work and assign technical parameters."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-7 py-2">
        {/* --- IDENTITY SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Identity & Scope
            </span>
          </div>

          <FormInput
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. Implement form validation logic"
            icon={
              <Target size={16} strokeWidth={2} className="text-accent" />
            }
            required
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Instructions & Details <span className="text-accent">*</span>
            </label>
            <div className="relative group">
              <AlignLeft
                size={16}
                className="absolute left-4 top-4 text-slate-500 group-focus-within:text-accent transition-colors duration-300"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Outline specific steps for the developer..."
                className={cn(
                  "field-input w-full pl-12 pr-4 py-4 text-sm transition-all duration-300",
                  "bg-white/[0.01] border border-white/10 rounded-xl min-h-[110px] outline-none text-white resize-none",
                  "placeholder:text-slate-700 focus:border-accent/40 hover:border-white/20",
                  errors.description && "border-red-500/40 bg-red-500/[0.01]",
                )}
              />
            </div>
            {errors.description && (
              <p className="text-[9px] text-red-400 mt-2 font-black uppercase tracking-widest ml-1">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* --- EXECUTION SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Execution State
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <FormDropdown
              label="Initial Status"
              name="status"
              value={formData.status || "Todo"}
              onChange={handleChange}
              options={statusOptions}
              required
              icon={<Info size={14} className="text-accent/60" />}
            />
            <FormInput
              label="Estimated Hours"
              name="estimatedHours"
              type="number"
              value={String(formData.estimatedHours || "")}
              onChange={handleChange}
              error={errors.estimatedHours}
              placeholder="e.g. 4.5"
              step="0.5"
              icon={
                <Clock size={16} strokeWidth={2} className="text-accent" />
              }
              required
            />
          </div>
        </div>

        {/* --- ASSIGNMENT SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Timeline & Ownership
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Due Date <span className="text-accent">*</span>
              </label>
              <div className="relative group">
                <Calendar
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors"
                />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={cn(
                    "field-input w-full pl-12 pr-4 h-12 bg-white/[0.01] border border-white/10 rounded-xl text-white text-sm outline-none",
                    "focus:border-accent/40 hover:border-white/20 transition-all",
                    errors.dueDate && "border-red-500/40 bg-red-500/[0.01]",
                  )}
                  required
                />
              </div>
              {errors.dueDate && (
                <p className="text-[9px] text-red-400 mt-2 font-black uppercase tracking-widest ml-1">
                  {errors.dueDate}
                </p>
              )}
            </div>

            <FormDropdown
              label="Assign To"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              options={employees.map(emp => ({ label: emp.name, value: emp.id }))}
              required
              placeholder="Select owner..."
              icon={<User size={14} strokeWidth={2} className="text-accent/60" />}
              error={errors.assignedTo}
            />
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-6 pt-8 mt-4 border-t border-white/[0.1]">
          <div className="hidden sm:flex items-center gap-3 text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Precision Unit Assigned
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={handleClose}
              className="flex-1 sm:flex-none h-12 px-8 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 sm:flex-none h-12 px-12 rounded-xl transition-all duration-300",
                "bg-accent text-[#08090a] font-black text-[11px] uppercase tracking-[0.3em]",
                "shadow-[0_8px_30px_rgb(var(--color-accent),.15)] hover:shadow-[0_8px_30px_rgb(var(--color-accent),.3)] flex items-center justify-center gap-3",
              )}
            >
              {loading ? (
                <div className="w-5 h-5 border-[3px] border-[#08090a]/20 border-t-[#08090a] rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={18} strokeWidth={3} />
                  <span>Create Task</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateTaskModal;
