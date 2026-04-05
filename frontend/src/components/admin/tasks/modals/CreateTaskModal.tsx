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
    if (formData.estimatedHours !== undefined && formData.estimatedHours < 0) {
      newErrors.estimatedHours = "Hours cannot be negative";
    }

    if (formData.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(formData.dueDate) < today) {
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
      status: formData.status as TaskStatus,
      estimatedHours: formData.estimatedHours
        ? Number(formData.estimatedHours)
        : 0,
    };

    if (formData.description?.trim())
      payload.description = formData.description.trim();
    if (formData.assignedTo) payload.assignedTo = formData.assignedTo;
    if (formData.dueDate) payload.dueDate = formData.dueDate;

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
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
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
              <Target size={16} strokeWidth={1.5} className="text-accent" />
            }
            required
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Instructions & Details
            </label>
            <div className="relative group">
              <AlignLeft
                size={16}
                className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-accent transition-colors duration-300"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Outline specific steps for the developer..."
                className={cn(
                  "field-input w-full pl-11 pr-4 py-3 text-sm transition-all duration-300",
                  "bg-white/[0.02] border border-white/10 rounded-xl min-h-[90px] outline-none text-white resize-none",
                  "placeholder:text-slate-700 focus:border-accent/40",
                )}
              />
            </div>
          </div>
        </div>

        {/* --- EXECUTION SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Execution State
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormDropdown
              label="Initial Status"
              name="status"
              value={formData.status || "Todo"}
              onChange={handleChange}
              options={statusOptions}
            />
            <FormInput
              label="Estimated Hours"
              name="estimatedHours"
              type="number"
              value={String(formData.estimatedHours || 0)}
              onChange={handleChange}
              error={errors.estimatedHours}
              placeholder="e.g. 4.5"
              step="0.5"
              icon={
                <Clock size={16} strokeWidth={1.5} className="text-accent" />
              }
            />
          </div>
        </div>

        {/* --- ASSIGNMENT SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Timeline & Ownership
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Due Date
              </label>
              <div className="relative group">
                <Calendar
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent"
                />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={cn(
                    "field-input w-full pl-11 pr-4 h-11 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm outline-none",
                    "focus:border-accent/40",
                    errors.dueDate && "border-red-500/50",
                  )}
                />
              </div>
              {errors.dueDate && (
                <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Assign To
              </label>
              <div className="relative group">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent"
                />
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="field-input w-full pl-11 pr-4 h-11 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm outline-none appearance-none cursor-pointer focus:border-accent/40"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Unit Validation Active
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={handleClose}
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
