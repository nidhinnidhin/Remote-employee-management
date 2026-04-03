"use client";

import React, { useState, useEffect } from "react";
import { X, User, Star, ListChecks, AlignLeft } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { StoryPriority, StoryPoints, StoryStatus, UserStory, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";
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
    storyPoints: 5,
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
        description: story.description || "",
        priority: story.priority,
        storyPoints: story.storyPoints,
        status: story.status,
        assigneeId: story.assigneeId || "",
        acceptanceCriteria: [...story.acceptanceCriteria],
      });
    }
  }, [story]);

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["Backlog", "In Progress", "Done"];
  const pointOptions: StoryPoints[] = [1, 2, 3, 5, 8, 13];

  const handleChange = (e: any) => {
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Summary is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.storyPoints) newErrors.storyPoints = "Points are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !story) return;

    setLoading(true);
    const result = await updateStoryAction(story.id, formData);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.STORY_UPDATED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || "Failed to update user story");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Story"
      description="Update requirements or assignment for this story."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Story Summary"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. As a user, I want to be able to reset my password"
          required
          icon={<Star size={16} />}
        />

        <div className="mb-0">
          <label className="field-label flex items-center gap-2">
            <AlignLeft size={14} className="text-secondary" />
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context and details for the developer..."
            className={cn("field-textarea min-h-[100px]", errors.description && "border-danger")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="space-y-2">
          <label className="field-label flex items-center gap-2">
            <ListChecks size={14} className="text-secondary" />
            Story Points
          </label>
          <div className="flex flex-wrap gap-2">
            {pointOptions.map((pts) => (
              <button
                key={pts}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, storyPoints: pts }))}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black transition-all border",
                  Number(formData.storyPoints) === pts
                    ? "bg-[rgb(var(--color-accent))] text-white border-[rgb(var(--color-accent))] shadow-lg shadow-[rgb(var(--color-accent))]/30 scale-105"
                    : "bg-surface-raised/40 text-muted border-border-subtle hover:border-[rgb(var(--color-accent))]/40"
                )}
              >
                {pts}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="field-label flex items-center gap-2 !mb-0">
              <CheckPlus size={14} className="text-secondary" />
              Acceptance Criteria
            </label>
            <span className="text-[10px] font-bold text-muted uppercase">
               {(formData.acceptanceCriteria?.length || 0)} / 20
            </span>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCriterion();
                }
              }}
              placeholder="Add new criterion..."
              className="field-input flex-1"
            />
            <Button
              variant="outline"
              onClick={addCriterion}
              className="px-4 border-accent text-accent hover:bg-accent/5 h-auto py-2"
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.acceptanceCriteria || []).map((criterion, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold animate-in fade-in zoom-in-95 duration-200"
              >
                <span className="truncate max-w-[200px]">{criterion}</span>
                <button
                  type="button"
                  onClick={() => removeCriterion(idx)}
                  className="p-1 hover:bg-accent/20 rounded-full transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-border-subtle/10">
          <label className="field-label flex items-center gap-2">
            <User size={14} className="text-secondary" />
            Assign to Employee
          </label>
          <select
            name="assigneeId"
            value={formData.assigneeId}
            onChange={handleChange}
            className="field-select"
          >
            <option value="">Unassigned</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-surface-raised/40 backdrop-blur-xl -mx-6 -mb-6 p-6 border-t border-border-subtle/30">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="px-8">
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

// Internal utility
const CheckPlus = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 11 3 3L22 4" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
    <path d="M11 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4" />
    <path d="M12 2v6" />
    <path d="M9 5h6" />
  </svg>
)

export default EditStoryModal;
