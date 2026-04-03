"use client";

import React, { useState, useEffect } from "react";
import { X, Star, AlignLeft, Clock, Calendar, User, Activity } from "lucide-react";
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
    if (!formData.title?.trim()) newErrors.title = "Task title is required";
    if (formData.estimatedHours !== undefined && Number(formData.estimatedHours) < 0) {
      newErrors.estimatedHours = "Hours cannot be negative";
    }
    if (formData.actualHours !== undefined && Number(formData.actualHours) < 0) {
      newErrors.actualHours = "Actual hours cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !task) return;

    setLoading(true);
    
    // Sanitize payload
    const payload: UpdateTaskPayload = {
      title: formData.title?.trim(),
      description: formData.description?.trim() || "",
      status: formData.status as TaskStatus,
      estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : 0,
      actualHours: formData.actualHours ? Number(formData.actualHours) : 0,
      assignedTo: formData.assignedTo || "",
      dueDate: formData.dueDate || "",
    };

    // Only send fields that have values if backend is strict, 
    // but here we can just ensure they are formatted correctly.
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
      title="Edit Task"
      description="Update task details, status, or progress tracking."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Task Title"
          name="title"
          value={formData.title || ""}
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
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Detailed instructions for the developer..."
            className={cn("field-textarea min-h-[80px]", errors.description && "border-danger")}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormDropdown
            label="Status"
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
                value={String(formData.estimatedHours || 0)}
                onChange={handleChange}
                error={errors.estimatedHours}
                step="0.5"
                min="0"
                icon={<Clock size={16} />}
             />
             <FormInput
                label="Actual (h)"
                name="actualHours"
                type="number"
                value={String(formData.actualHours || 0)}
                onChange={handleChange}
                error={errors.actualHours}
                step="0.5"
                min="0"
                icon={<Activity size={16} />}
             />
          </div>
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
               value={formData.dueDate || ""}
               onChange={handleChange}
               className={cn("field-input", errors.dueDate && "border-danger")}
             />
           </div>

           <div>
             <label className="field-label flex items-center gap-2">
               <User size={14} className="text-secondary" />
               Assign To
             </label>
             <select
               name="assignedTo"
               value={formData.assignedTo || ""}
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
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="px-8">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default EditTaskModal;
