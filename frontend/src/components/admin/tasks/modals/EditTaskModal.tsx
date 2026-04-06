"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Star, 
  AlignLeft, 
  Clock, 
  Calendar, 
  User, 
  Activity, 
  Info, 
  Target 
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { Task, TaskStatus, UpdateTaskPayload } from "@/shared/types/company/projects/task.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { updateTaskAction } from "@/actions/company/projects/task.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { cn } from "@/lib/utils";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
  employees: Employee[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  task,
  employees,
}) => {
  const [formData, setFormData] = useState<UpdateTaskPayload>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours || 0,
        assignedTo: task.assignedTo || "",
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : "",
      });
    }
  }, [task]);

  const statusOptions = ["Todo", "In Progress", "Done"];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Task title is required";
    if (!formData.description?.trim()) newErrors.description = "Task description is required";
    if (!formData.assignedTo) newErrors.assignedTo = "Assignee is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    
    if (formData.estimatedHours === undefined || Number(formData.estimatedHours) <= 0) {
      newErrors.estimatedHours = "Estimated hours must be greater than 0";
    }
    if (formData.actualHours !== undefined && Number(formData.actualHours) < 0) {
      newErrors.actualHours = "Actual hours cannot be negative";
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
    if (!validate() || !task) return;

    setLoading(true);
    
    const payload: UpdateTaskPayload = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      status: formData.status as TaskStatus,
      estimatedHours: Number(formData.estimatedHours),
      actualHours: Number(formData.actualHours),
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
    };

    const result = await updateTaskAction(task.id, payload);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.TASK_UPDATED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || "Failed to update task");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Edit Task Details"
      description="Refine task scope, adjust timelines, or track actual execution progress."
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
            value={formData.title || ""}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. Implement form validation logic"
            icon={<Target size={16} strokeWidth={1.5} className="text-accent" />}
            required
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Refined Instructions <span className="text-accent">*</span>
            </label>
            <div className="relative group">
              <AlignLeft
                size={16}
                className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-accent transition-colors duration-300"
              />
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                placeholder="Detailed technical notes..."
                className={cn(
                  "field-input w-full pl-11 pr-4 py-3 text-sm transition-all duration-300",
                  "bg-white/[0.02] border border-white/10 rounded-xl min-h-[90px] outline-none text-white resize-none",
                  "placeholder:text-slate-700 focus:border-accent/40",
                  errors.description && "border-red-500/50",
                )}
              />
            </div>
            {errors.description && (
              <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* --- PROGRESS TRACKING SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Execution & Progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormDropdown
              label="Task Status"
              name="status"
              value={formData.status || "Todo"}
              onChange={handleChange}
              options={statusOptions}
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <FormInput
                label="Est. (h)"
                name="estimatedHours"
                type="number"
                value={String(formData.estimatedHours || "")}
                onChange={handleChange}
                error={errors.estimatedHours}
                step="0.5"
                icon={<Clock size={16} strokeWidth={1.5} className="text-accent/60" />}
                required
              />
              <FormInput
                label="Actual (h)"
                name="actualHours"
                type="number"
                value={String(formData.actualHours || 0)}
                onChange={handleChange}
                error={errors.actualHours}
                step="0.5"
                icon={<Activity size={16} strokeWidth={1.5} className="text-accent" />}
                required
              />
            </div>
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
                Due Date <span className="text-accent">*</span>
              </label>
              <div className="relative group">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate || ""}
                  onChange={handleChange}
                  className={cn(
                    "field-input w-full pl-11 pr-4 h-11 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm outline-none",
                    "focus:border-accent/40",
                    errors.dueDate && "border-red-500/50"
                  )}
                  required
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
                Reassign Owner <span className="text-accent">*</span>
              </label>
              <div className="relative group">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                <select
                  name="assignedTo"
                  value={formData.assignedTo || ""}
                  onChange={handleChange}
                  className={cn(
                    "field-input w-full pl-11 pr-4 h-11 bg-white/[0.02] border border-white/10 rounded-xl text-white text-sm outline-none appearance-none cursor-pointer focus:border-accent/40 transition-all",
                    errors.assignedTo && "border-red-500/50"
                  )}
                  required
                >
                  <option value="">Select Assignee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              {errors.assignedTo && (
                <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">
                  {errors.assignedTo}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500/60">
              Live State Persistence
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
            >
              Discard
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
                  <Target size={16} strokeWidth={3} />
                  <span>Update Task</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditTaskModal;