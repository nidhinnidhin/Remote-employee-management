"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Target,
  Rocket,
  Timer,
  Calendar,
  Clock,
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
        toast.success("Sprint updated successfully");
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
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Edit Sprint: ${sprint.name}`}>
      <div className="relative overflow-hidden">
        {/* --- Header Decoration --- */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <form onSubmit={handleSubmit} className="relative space-y-8 py-4 px-2">
          {/* --- Sprint Name Section --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Timer size={14} className="text-orange-500" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                General Information
              </h3>
            </div>
            
            <FormInput
              label="Sprint Name"
              name="name"
              placeholder="e.g., Sprint 1: Foundation Phase"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
              className="bg-white/[0.02] border-white/[0.08] focus:border-orange-500/40 focus:bg-orange-500/[0.02] transition-all"
            />

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                Sprint Goal
              </label>
              <textarea
                name="goal"
                placeholder="What is the primary mission for this cycle?"
                value={formData.goal}
                onChange={handleChange}
                rows={3}
                className={cn(
                  "w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all resize-none min-h-[80px]",
                  errors.goal && "border-rose-500/50 focus:border-rose-500/50"
                )}
              />
              {errors.goal && (
                <p className="text-[10px] font-medium text-rose-500 pl-1">{errors.goal}</p>
              )}
            </div>
          </div>

          {/* --- Timeline Section --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Calendar size={14} className="text-emerald-500" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Duration & Schedule
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-emerald-500/40 focus:bg-emerald-500/[0.02] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={cn(
                    "w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 h-12 text-[13px] text-white outline-none focus:border-orange-500/40 focus:bg-orange-500/[0.02] transition-all",
                    errors.endDate && "border-rose-500/50"
                  )}
                />
                {errors.endDate && (
                   <p className="text-[10px] font-medium text-rose-500 pl-1">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.05]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              isLoading={loading}
              className="h-12 px-10 rounded-xl bg-orange-500 text-[#08090a] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all"
            >
              Update Sprint
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default EditSprintModal;
