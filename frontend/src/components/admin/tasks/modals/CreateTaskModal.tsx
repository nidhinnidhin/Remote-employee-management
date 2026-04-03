"use client";

import React, { useState } from "react";
import { X, Star, AlignLeft, Clock, Calendar, User, ListChecks } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { TaskStatus, CreateTaskPayload } from "@/shared/types/company/projects/task.type";
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
  const [formData, setFormData] = useState<Omit<CreateTaskPayload, 'projectId' | 'storyId'>>({
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
    
    // Sanitize payload
    const payload: CreateTaskPayload = {
      projectId,
      storyId,
      title: formData.title.trim(),
      status: formData.status as TaskStatus,
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : 0,
    };

    if (formData.description?.trim()) payload.description = formData.description.trim();
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
      title="Create Task"
      description="Define a specific unit of work for this user story."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="e.g. Implement form validation logic"
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
            placeholder="Detailed instructions for the developer..."
            className={cn("field-textarea min-h-[80px]", errors.description && "border-danger")}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormDropdown
            label="Initial Status"
            name="status"
            value={formData.status || "Todo"}
            onChange={handleChange}
            options={statusOptions}
            required
          />
          <FormInput
            label="Est. Hours"
            name="estimatedHours"
            type="number"
            value={String(formData.estimatedHours || 0)}
            onChange={handleChange}
            error={errors.estimatedHours}
            placeholder="e.g. 4.5"
            step="0.5"
            min="0"
            icon={<Clock size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="field-label flex items-center gap-2">
               <Calendar size={14} className="text-secondary" />
               Due Date
             </label>
             <input
               type="date"
               name="dueDate"
               value={formData.dueDate}
               onChange={handleChange}
               className={cn("field-input", errors.dueDate && "border-danger")}
             />
             {errors.dueDate && <p className="text-[10px] text-danger mt-1 font-bold">{errors.dueDate}</p>}
           </div>

           <div>
             <label className="field-label flex items-center gap-2">
               <User size={14} className="text-secondary" />
               Assign To
             </label>
             <select
               name="assignedTo"
               value={formData.assignedTo}
               onChange={handleChange}
               className="field-select"
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

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-surface-raised/40 backdrop-blur-xl -mx-6 -mb-6 p-6 border-t border-border-subtle/30">
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="px-8">
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default CreateTaskModal;
