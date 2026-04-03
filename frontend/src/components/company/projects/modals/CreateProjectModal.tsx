"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { CreateProjectPayload } from "@/shared/types/company/projects/project.type";
import { createProjectAction } from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";

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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.name.trim()) newErrors.name = "Project name is required";
    
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
    if (!validate()) return;

    setLoading(true);
    const result = await createProjectAction(formData);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.PROJECT_CREATED);
      onSuccess();
      handleClose();
    } else {
      toast.error(result.error || PROJECT_MESSAGES.PROJECT_CREATE_FAILED);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      status: "Active",
    });
    setErrors({});
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      description="Fill in the details to start a new project."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Project Name"
          name="name"
          value={formData.name}
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
            value={formData.description}
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
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateProjectModal;
