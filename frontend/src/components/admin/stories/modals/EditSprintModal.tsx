"use client";

import React, { useState, useEffect } from "react";
import {
  Timer,
  Calendar,
  Save,
} from "lucide-react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { updateSprintAction } from "@/actions/company/projects/sprint.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Sprint } from "@/shared/types/company/projects/sprint.type";

interface EditSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sprint: Sprint | null;
}

const EditSprintModal: React.FC<EditSprintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  sprint,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sprint) {
      setFormData({
        name: sprint.name,
        goal: sprint.goal || "",
        startDate: sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : "",
        endDate: sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : "",
      });
    }
  }, [sprint]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
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
    if (formData.name.length < 3) newErrors.name = "Sprint name must be at least 3 characters";
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sprint || !validateForm()) return;

    setLoading(true);
    try {
      const result = await updateSprintAction(sprint.id, formData);

      if (result.success) {
        toast.success("Sprint configuration updated");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Failed to update sprint");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!sprint) return null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="" 
      theme="theme-company"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col">
        {/* --- Header --- */}
        <h1 className="text-xl font-black text-white text-center uppercase tracking-tighter mb-6">
          Edit Sprint Configuration
        </h1>

        {/* --- Icon Header --- */}
        <div className="flex justify-center mb-8">
          <div className="p-5 rounded-full border border-white/10 bg-white/5">
            <Timer size={28} className="text-indigo-400" strokeWidth={2.5} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- General Section --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1 border-l-2 border-indigo-500/50 pl-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Designation & Goal
              </span>
            </div>
            
            <FormInput
              label="Sprint Name"
              name="name"
              placeholder="e.g., Sprint 01"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              className="bg-white/[0.03] border-white/10"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Strategic Objective
              </label>
              <textarea
                name="goal"
                placeholder="What is the primary mission?"
                value={formData.goal}
                onChange={(e) => handleChange({ target: { name: 'goal', value: e.target.value } })}
                className={cn(
                  "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all resize-none min-h-[100px]",
                  errors.goal && "border-rose-500/50"
                )}
              />
            </div>
          </div>

          {/* --- Timeline Section --- */}
          <div className="space-y-4 pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-2 px-1 border-l-2 border-indigo-500/50 pl-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                Lifecycle State
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-indigo-400" />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={(e) => handleChange({ target: { name: 'startDate', value: e.target.value } })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={12} className="text-blue-400" />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) => handleChange({ target: { name: 'endDate', value: e.target.value } })}
                  className={cn(
                    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-indigo-500/50 transition-all",
                    errors.endDate && "border-rose-500/50"
                  )}
                />
              </div>
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              Abort
            </button>
            <Button
              type="submit"
              isLoading={loading}
              className="h-14 px-10 rounded-2xl bg-gradient-to-br from-[#7c7fff] to-[#4e84ff] text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-2">
                <Save size={16} strokeWidth={3} />
                Save Changes
              </div>
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default EditSprintModal;