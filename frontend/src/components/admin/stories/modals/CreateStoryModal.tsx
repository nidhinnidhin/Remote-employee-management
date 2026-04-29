"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  User,
  Star,
  ListChecks,
  AlignLeft,
  CheckCircle2,
  Info,
  Target,
  Zap,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import {
  CreateStoryPayload,
} from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { createStoryAction } from "@/actions/company/projects/story.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { cn } from "@/lib/utils";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  employees: Employee[];
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  employees,
}) => {
  const [formData, setFormData] = useState<
    Omit<CreateStoryPayload, "projectId">
  >({
    title: "",
    description: "",
    priority: "Medium",
    status: "Backlog",
    assigneeId: "",
    acceptanceCriteria: [],
    storyPoints: 1,
  });

  const [newCriterion, setNewCriterion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["Backlog", "In Progress", "Done"];
  const storyPointOptions = [1, 2, 3, 5, 8, 13];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const addCriterion = () => {
    if (!newCriterion.trim() || formData.acceptanceCriteria.length >= 20)
      return;
    setFormData((prev) => ({
      ...prev,
      acceptanceCriteria: [...prev.acceptanceCriteria, newCriterion.trim()],
    }));
    setNewCriterion("");
    if (errors.acceptanceCriteria) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.acceptanceCriteria;
        return next;
      });
    }
  };

  const removeCriterion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      acceptanceCriteria: prev.acceptanceCriteria.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Story summary is required";
    if (!formData.description.trim()) newErrors.description = "Story description is required";
    if (!formData.assigneeId) newErrors.assigneeId = "Assignee is required";
    if (formData.acceptanceCriteria.length === 0) {
      newErrors.acceptanceCriteria = "At least one acceptance criterion is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await createStoryAction({ ...formData, projectId });
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.STORY_CREATED);
      onSuccess();
      handleClose();
    } else {
      toast.error(result.error || "Failed to create story");
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      status: "Backlog",
      assigneeId: "",
      acceptanceCriteria: [],
      storyPoints: 1,
    });
    setErrors({});
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      theme="theme-company"
      title="Create User Story"
      description="Define a new piece of work for the project and establish its success criteria."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-7 py-2">
        {/* --- IDENTITY SECTION --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Identity & Context
            </span>
          </div>

          <FormInput
            label="Story Summary"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. As a user, I want to be able to reset my password"
            icon={<Star size={16} strokeWidth={2} className="text-accent" />}
            required
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Description & Details <span className="text-accent">*</span>
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
                placeholder="Provide technical context and user journey details..."
                className={cn(
                  "field-input w-full pl-12 pr-4 py-4 text-sm transition-all duration-300",
                  "bg-white/[0.01] border border-white/10 rounded-xl min-h-[120px] outline-none text-white resize-none",
                  "placeholder:text-slate-700 focus:border-accent/40 focus:bg-accent/[0.01] hover:border-white/20",
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

        {/* --- PARAMETERS SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Technical Parameters
            </span>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <FormDropdown
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              required
              icon={<Zap size={14} className="text-accent/60" />}
            />
            <FormDropdown
              label="Initial Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
              required
              icon={<ListChecks size={14} className="text-accent/60" />}
            />
            <FormDropdown
              label="Story Points"
              name="storyPoints"
              value={formData.storyPoints.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, storyPoints: parseInt(e.target.value) }))}
              options={storyPointOptions.map(String)}
              required
              icon={<Target size={14} className="text-accent/60" />}
            />
          </div>
        </div>

        {/* --- CRITERIA SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Success Indicators <span className="text-accent">*</span>
            </span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              {formData.acceptanceCriteria.length} / 20 Criteria
            </span>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Target
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCriterion())
                }
                placeholder="Define an acceptance criterion..."
                className={cn(
                  "field-input w-full pl-12 pr-4 h-12 bg-white/[0.01] border border-white/10 rounded-xl outline-none text-white text-sm focus:border-accent/40 hover:border-white/20 transition-all",
                  errors.acceptanceCriteria && "border-red-500/40 bg-red-500/[0.01]",
                )}
              />
            </div>
            <button
              type="button"
              onClick={addCriterion}
              className="h-12 px-8 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-[0.98] active:bg-white/20"
            >
              Add
            </button>
          </div>
          {errors.acceptanceCriteria && (
            <p className="text-[9px] text-red-400 mt-2 font-black uppercase tracking-widest ml-1">
              {errors.acceptanceCriteria}
            </p>
          )}

          {/* Criteria List */}
          <div className="grid grid-cols-1 gap-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
            {formData.acceptanceCriteria.map((criterion, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] group hover:border-accent/20 hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2
                    size={15}
                    className="text-accent/30 group-hover:text-accent transition-colors"
                  />
                  <span className="text-[13px] text-slate-400 group-hover:text-slate-200 transition-colors">
                    {criterion}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCriterion(idx)}
                  className="text-slate-600 hover:text-red-400 p-1.5 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- ASSIGNEE SECTION --- */}
        <div className="pt-6 border-t border-white/[0.06]">
          <FormDropdown
            label="Assign to Story Owner"
            name="assigneeId"
            value={formData.assigneeId}
            onChange={handleChange}
            options={employees.map(emp => ({ label: emp.name, value: emp.id }))}
            required
            placeholder="Select a project contributor..."
            icon={<User size={14} strokeWidth={2} className="text-accent/60" />}
            error={errors.assigneeId}
          />
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-6 pt-8 mt-4 border-t border-white/[0.1]">
          <div className="hidden sm:flex items-center gap-3 text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Unit Integrity Check Active
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
                  <span>Create Story</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateStoryModal;
