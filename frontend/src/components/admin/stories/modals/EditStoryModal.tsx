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
import { UserStoryPriority, UserStoryStatus, UserStory, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { updateStoryAction, uploadResourceAction } from "@/actions/company/projects/story.actions";
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
    priority: UserStoryPriority.MEDIUM,
    status: UserStoryStatus.BACKLOG,
    type: "Story",
    storyPoints: 1,
    assigneeId: "",
    acceptanceCriteria: [],
    attachments: [],
    links: [],
  });

  const [newCriterion, setNewCriterion] = useState("");
  const [newLink, setNewLink] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (story) {
      setFormData({
        title: story.title,
        description: story.description,
        priority: story.priority,
        status: story.status,
        type: story.type || "Story",
        storyPoints: story.storyPoints || 1,
        assigneeId: story.assigneeId,
        acceptanceCriteria: [...story.acceptanceCriteria],
        attachments: [...(story.attachments || [])],
        links: [...(story.links || [])],
      });
    }
  }, [story]);

  const priorityOptions = Object.values(UserStoryPriority);
  const statusOptions = Object.values(UserStoryStatus);

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
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Identity & Context
            </span>
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              {["Story", "Bug"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: type as any }))}
                  className={cn(
                    "px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-md transition-all",
                    formData.type === type
                      ? "bg-accent text-[#08090a] shadow-[0_0_15px_rgba(var(--color-accent),0.3)]"
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <FormInput
            label={`${formData.type} Summary`}
            name="title"
            value={formData.title || ""}
            onChange={handleChange}
            error={errors.title}
            placeholder={formData.type === "Story" ? "As a user..." : "Unexpected behavior in..."}
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
                placeholder="Provide technical context..."
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
              value={formData.priority || UserStoryPriority.MEDIUM}
              onChange={handleChange}
              options={priorityOptions}
              required
              icon={<Zap size={14} className="text-accent/60" />}
              variant="accent"
            />
            <FormDropdown
              label="Status"
              name="status"
              value={formData.status || UserStoryStatus.BACKLOG}
              onChange={handleChange}
              options={statusOptions}
              required
              icon={<ListChecks size={14} className="text-accent/60" />}
              variant="accent"
            />
            {formData.type === "Story" && (
              <FormDropdown
                label="Story Points"
                name="storyPoints"
                value={(formData.storyPoints || 1).toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, storyPoints: parseInt(e.target.value) }))}
                options={["1", "2", "3", "5", "8", "13"]}
                required
                icon={<Target size={14} className="text-accent/60" />}
                variant="accent"
              />
            )}
          </div>
        </div>

        {/* --- CRITERIA SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Success Indicators <span className="text-accent">*</span>
            </span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
              {(formData.acceptanceCriteria?.length || 0)} / 20 Criteria
            </span>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Target size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCriterion())}
                placeholder="Define acceptance criterion..."
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

          <div className="grid grid-cols-1 gap-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
            {(formData.acceptanceCriteria || []).map((criterion, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] group hover:border-accent/20 hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle2 size={15} className="text-accent/30 group-hover:text-accent transition-colors" />
                  <span className="text-[13px] text-slate-400 group-hover:text-slate-200 transition-colors">{criterion}</span>
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

        {/* --- RESOURCES SECTION --- */}
        <div className="space-y-6 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-1 border-l-[3px] border-accent/40 pl-4 py-0.5">
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">
              Resources & Visual References
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
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

        {/* --- ASSIGNEE SECTION --- */}
        <div className="pt-6 border-t border-white/[0.06]">
          <FormDropdown
            label="Reassign Issue Owner"
            name="assigneeId"
            value={formData.assigneeId}
            onChange={handleChange}
            options={employees.map(emp => ({ label: emp.name, value: emp.id }))}
            required
            placeholder="Select a new owner..."
            icon={<User size={14} strokeWidth={2} className="text-accent/60" />}
            error={errors.assigneeId}
            variant="accent"
          />
        </div>

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between gap-6 pt-8 mt-4 border-t border-white/[0.1]">
          <div className="hidden sm:flex items-center gap-3 text-slate-600">
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Synchronous Persistence Active
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
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
                  <Zap size={18} strokeWidth={3} />
                  <span>Update {formData.type}</span>
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