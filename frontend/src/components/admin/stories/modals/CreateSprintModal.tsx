"use client";

import React, { useState } from "react";
import { Target, Timer } from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { createSprintAction } from "@/actions/company/projects/sprint.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
}) => {
  const [formData, setFormData] = useState({ name: "", goal: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Sprint name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await createSprintAction(projectId, { ...formData, projectId });
      if (result.success) {
        toast.success("Sprint initialized");
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || "Failed to initialize");
      }
    } catch (error) {
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", goal: "" });
    setErrors({});
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="" 
      theme="theme-company"
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col">
        {/* --- Header --- */}
        <h1 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-6">
          Initialize Sprint
        </h1>

        {/* --- Icon --- */}
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-full border border-white/10 bg-white/5">
            <Timer size={28} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h2 className="text-lg font-black text-white text-center uppercase tracking-tight mb-8">
          Ready to Start?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <FormInput
              label="Sprint Name" // Added required prop to fix TS(2741)
              name="name"
              placeholder="e.g., SPRINT 01"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              className="bg-white/[0.03] border-white/10 h-12 rounded-xl text-white placeholder:text-slate-600 focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* --- Sprint Goal --- */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Sprint Goal
            </label>
            <textarea
              name="goal"
              placeholder="What is the primary mission?"
              value={formData.goal}
              onChange={handleChange}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-slate-600 focus:border-indigo-500/50 outline-none transition-all resize-none min-h-[100px]"
            />
          </div>

          {/* --- Actions --- */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>

            <Button
              type="submit"
              isLoading={loading}
              className="h-14 px-8 rounded-2xl bg-gradient-to-br from-[#7c7fff] to-[#4e84ff] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <Target size={16} strokeWidth={3} />
                Initialize Sprint
              </div>
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default CreateSprintModal;