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
  Image as ImageIcon,
  Upload,
  Camera,
  Link2,
  Paperclip,
  Layers,
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
import { createTaskAction, uploadResourceAction } from "@/actions/company/projects/task.actions";
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
    attachments: [],
    links: [],
  });

  const [newLink, setNewLink] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const statusOptions = ["Todo", "In Progress", "Review", "Done"];

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
      attachments: formData.attachments || [],
      links: formData.links || [],
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadResourceAction(formData);
        if (result.success && result.data?.url) {
          uploadedUrls.push(result.data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => {
      const attachments = prev.attachments || [];
      if (attachments[index].startsWith('blob:')) {
        URL.revokeObjectURL(attachments[index]);
      }
      return {
        ...prev,
        attachments: attachments.filter((_, i) => i !== index),
      };
    });
  };

  const addLink = () => {
    if (!newLink.trim()) return;
    setFormData((prev) => ({
      ...prev,
      links: [...(prev.links || []), newLink.trim()],
    }));
    setNewLink("");
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, i) => i !== index),
    }));
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      status: TaskStatus.TODO,
      estimatedHours: 0,
      assignedTo: "",
      dueDate: "",
      attachments: [],
      links: [],
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
              variant="accent"
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
              variant="accent"
            />
          </div>
        </div>

        {/* --- RESOURCES SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Resources & Visual References
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Attachments / Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Image Attachments
                </label>
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  {formData.attachments?.length || 0} Files
                </span>
              </div>

              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="task-image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="task-image-upload"
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed transition-all duration-300",
                    isUploading ? "border-accent/40 bg-accent/[0.05] cursor-wait" : "border-white/10 bg-white/[0.01] hover:border-accent/40 hover:bg-accent/[0.02] cursor-pointer",
                    "group-active:scale-[0.98]",
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      isUploading ? "bg-accent/20 text-accent animate-pulse" : "bg-white/5 text-slate-400 group-hover:text-accent"
                    )}>
                      {isUploading ? <Layers size={20} className="animate-spin" /> : <Upload size={20} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 text-center px-4">
                      {isUploading ? "Transmitting data to cloud..." : "Drop images or click to upload"}
                    </span>
                  </div>
                </label>
              </div>

              {/* Image Preview Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {formData.attachments?.map((src, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={src}
                      alt={`Preview ${idx}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                External Links & Documentation
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://..."
                    className="field-input w-full pl-10 pr-4 h-12 bg-white/[0.01] border border-white/10 rounded-xl outline-none text-white text-sm focus:border-accent/40 transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={addLink}
                  className="h-12 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                {formData.links?.map((link, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] group hover:border-accent/20 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <Link2 size={12} className="text-accent/40" />
                      <span className="text-[12px] text-slate-400 truncate group-hover:text-slate-200 transition-colors">{link}</span>
                    </div>
                    <button type="button" onClick={() => removeLink(idx)} className="text-slate-600 hover:text-red-400 p-1.5 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
