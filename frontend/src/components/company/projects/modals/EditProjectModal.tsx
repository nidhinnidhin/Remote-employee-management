"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { Project, UpdateProjectPayload } from "@/shared/types/company/projects/project.type";
import { updateProjectAction } from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project | null;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project,
}) => {
  const [formData, setFormData] = useState<UpdateProjectPayload>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        startDate: project.startDate ? project.startDate.split('T')[0] : "",
        endDate: project.endDate ? project.endDate.split('T')[0] : "",
        status: project.status,
      });
    }
  }, [project]);

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Project name is required";
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !validate()) return;

    setLoading(true);
    const result = await updateProjectAction(project._id || project.id || "", formData);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.PROJECT_UPDATED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || PROJECT_MESSAGES.PROJECT_UPDATE_FAILED);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      description="Update the project details below."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Project Name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          error={errors.name}
          placeholder="e.g. Website Redesign"
          required
        />

        <div className="mb-0">
          <label className="block text-sm font-semibold mb-1.5 text-secondary">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Describe the project goals and scope..."
            className="field-input min-h-[100px] resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate || ""}
            onChange={handleChange}
          />
          <FormInput
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate || ""}
            onChange={handleChange}
            error={errors.endDate}
          />
        </div>

        <FormDropdown
          label="Status"
          name="status"
          value={formData.status || "Active"}
          onChange={handleChange}
          options={["Active", "On Hold", "Completed"]}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Project"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditProjectModal;
