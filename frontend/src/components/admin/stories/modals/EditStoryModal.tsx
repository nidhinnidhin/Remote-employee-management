"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Star, 
  ListChecks, 
  AlignLeft, 
  CheckCircle2, 
  Info, 
  Zap, 
  Target 
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { StoryPriority, StoryStatus, UserStory, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { updateStoryAction } from "@/actions/company/projects/story.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { cn } from "@/lib/utils";

interface EditStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  story: UserStory | null;
  employees: Employee[];
}

const EditStoryModal: React.FC<EditStoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  story,
  employees,
}) => {
  const [formData, setFormData] = useState<UpdateStoryPayload>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Backlog",
    assigneeId: "",
    acceptanceCriteria: [],
  });

  const [newCriterion, setNewCriterion] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        description: story.description,
        priority: story.priority,
        status: story.status,
        assigneeId: story.assigneeId,
        acceptanceCriteria: [...story.acceptanceCriteria],
      });
    }
  }, [story]);

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["Backlog", "In Progress", "Done"];

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
    if (!newCriterion.trim()) return;
    if ((formData.acceptanceCriteria?.length || 0) >= 20) {
      toast.warning("Maximum of 20 criteria allowed.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      acceptanceCriteria: [...(prev.acceptanceCriteria || []), newCriterion.trim()],
    }));
    setNewCriterion("");
  };

  const removeCriterion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      acceptanceCriteria: (prev.acceptanceCriteria || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;

    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Story summary is required";
    if (!formData.description?.trim()) newErrors.description = "Story description is required";
    if (!formData.assigneeId) newErrors.assigneeId = "Assignee is required";
    if (!formData.acceptanceCriteria || formData.acceptanceCriteria.length === 0) {
      newErrors.acceptanceCriteria = "At least one acceptance criterion is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await updateStoryAction(story.id, formData);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.STORY_UPDATED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || "Failed to update story");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Edit User Story"
      description="Refine story details, adjust complexity, or reassign ownership."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-7 py-2">
        
        {/* --- IDENTITY SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Identity & Context
            </span>
          </div>

          <FormInput
            label="Story Summary"
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. As a user, I want to be able to reset my password"
            icon={<Star size={16} strokeWidth={1.5} className="text-accent" />}
            required
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Description & Details <span className="text-accent">*</span>
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
                placeholder="Provide technical context..."
                className={cn(
                  "field-input w-full pl-11 pr-4 py-3 text-sm transition-all duration-300",
                  "bg-white/[0.02] border border-white/10 rounded-xl min-h-[100px] outline-none text-white resize-none",
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

        {/* --- PARAMETERS SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Technical Parameters
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormDropdown
              label="Priority"
              name="priority"
              value={formData.priority || "Medium"}
              onChange={handleChange}
              options={priorityOptions}
              required
            />
            <FormDropdown
              label="Status"
              name="status"
              value={formData.status || "Backlog"}
              onChange={handleChange}
              options={statusOptions}
              required
            />
          </div>
        </div>

        {/* --- CRITERIA SECTION --- */}
        <div className="space-y-4 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center justify-between px-1 border-l-2 border-accent/30 pl-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Success Indicators <span className="text-accent">*</span>
            </span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
               {(formData.acceptanceCriteria?.length || 0)} / 20 Criteria
            </span>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Target size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                placeholder="Define acceptance criterion..."
                className={cn(
                  "field-input w-full pl-11 pr-4 h-11 bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white text-sm focus:border-accent/40 transition-all",
                  errors.acceptanceCriteria && "border-red-500/50",
                )}
              />
            </div>
            <button
              type="button"
              onClick={addCriterion}
              className="h-11 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
            >
              Add
            </button>
          </div>
          {errors.acceptanceCriteria && (
            <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">
              {errors.acceptanceCriteria}
            </p>
          )}

          <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
            {(formData.acceptanceCriteria || []).map((criterion, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.03] bg-white/[0.01] group hover:border-accent/20 transition-all"
              >
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={14} className="text-accent/40 group-hover:text-accent transition-colors" />
                   <span className="text-[12px] text-slate-400 group-hover:text-slate-200 transition-colors">{criterion}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => removeCriterion(idx)} 
                  className="text-slate-600 hover:text-red-400 p-1 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* --- ASSIGNEE SECTION --- */}
        <div className="pt-2 border-t border-white/[0.04]">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <User size={13} strokeWidth={2} /> Reassign Story Owner <span className="text-accent">*</span>
            </label>
            <div className="relative group">
              <select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                className={cn(
                  "w-full bg-white/[0.02] border border-white/10 rounded-xl h-11 px-4 text-sm text-slate-300 outline-none",
                  "focus:border-accent/40 appearance-none cursor-pointer hover:bg-white/[0.04] transition-all",
                  errors.assigneeId && "border-red-500/50",
                )}
                required
              >
                <option value="">Select Assignee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>
            {errors.assigneeId && (
              <p className="text-[9px] text-red-400 mt-1 font-bold uppercase tracking-tighter">
                {errors.assigneeId}
              </p>
            )}
          </div>
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
          <div className="hidden sm:flex items-center gap-2 text-slate-600">
            <Info size={14} strokeWidth={2} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Update in Progress
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
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
                  <Zap size={16} strokeWidth={3} />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditStoryModal;