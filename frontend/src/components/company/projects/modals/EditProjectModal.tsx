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
import { Layout, FileText, Calendar, Info, RefreshCcw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

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
      theme="theme-company"
      title="Edit Project Details"
      description="Modify existing parameters for this project node."
      maxWidth="max-w-xl"
    >
      <div className="theme-company px-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- SECTION: CORE IDENTITY --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Identity & Scope
              </span>
            </div>

            <FormInput
              label="Project Name"
              name="name"
              value={formData.name ?? ""}
              onChange={handleChange}
              error={errors.name}
              icon={<Layout size={16} strokeWidth={1.5} />}
              placeholder="Enter project name..."
              required
            />

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Objectives & Description
              </label>
              <div className="relative group">
                <FileText 
                  size={16} 
                  className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-accent transition-colors duration-300" 
                />
                <textarea
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  className={cn(
                    "field-input w-full pl-11 pr-4 py-3 text-sm transition-all duration-300",
                    "bg-white/[0.02] border border-white/10 rounded-xl min-h-[110px] outline-none text-white resize-none",
                    "placeholder:text-slate-700 focus:border-accent/40 focus:bg-accent/[0.01]"
                  )}
                  placeholder="Update description..."
                />
              </div>
            </div>
          </div>

          {/* --- SECTION: TIMELINE & STATUS --- */}
          <div className="space-y-4 pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Lifecycle State
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate ?? ""}
                onChange={handleChange}
                icon={<Calendar size={16} strokeWidth={1.5} />}
              />
              <FormInput
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate ?? ""}
                onChange={handleChange}
                error={errors.endDate}
                icon={<Calendar size={16} strokeWidth={1.5} />}
              />
            </div>

            <FormDropdown
              label="Operational Status"
              name="status"
              value={formData.status ?? "Active"}
              onChange={handleChange}
              options={["Active", "On Hold", "Completed"]}
            />
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <Info size={14} strokeWidth={2} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Updates tracked
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="ghost"
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
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
                  "shadow-lg shadow-accent/10 hover:shadow-accent/30 flex items-center justify-center gap-2"
                )}
              >
                {loading ? (
                  <>
                    <RefreshCcw size={14} className="animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} strokeWidth={3} />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default EditProjectModal;