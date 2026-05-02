"use client";

import React, { useState } from "react";
import {
  X,
  Target,
  Rocket,
  Timer,
  FileText,
} from "lucide-react";
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
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
  });

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
    if (formData.name.length < 3) newErrors.name = "Sprint name must be at least 3 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await createSprintAction(projectId, {
        ...formData,
        projectId,
      });

      if (result.success) {
        toast.success("Sprint initialized successfully");
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || "Failed to initialize sprint");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
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
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Initialize New Sprint">
      <div className="relative overflow-hidden">
        {/* --- Header Decoration --- */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <form onSubmit={handleSubmit} className="relative space-y-8 py-4">
          {/* --- Sprint Name Section --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <Timer size={14} className="text-orange-500" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Designation
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
          </div>

          {/* --- Sprint Goal Section --- */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-accent/10 border border-accent/20">
                <Target size={14} className="text-accent" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Strategic Objective
              </h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                Sprint Goal
              </label>
              <textarea
                name="goal"
                placeholder="What is the primary mission for this cycle?"
                value={formData.goal}
                onChange={handleChange}
                rows={4}
                className={cn(
                  "w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white placeholder:text-slate-600 outline-none focus:border-accent/40 focus:bg-accent/[0.02] transition-all resize-none min-h-[120px]",
                  errors.goal && "border-rose-500/50 focus:border-rose-500/50"
                )}
              />
              {errors.goal && (
                <p className="text-[10px] font-medium text-rose-500 pl-1">{errors.goal}</p>
              )}
            </div>
          </div>

          {/* --- Info Card --- */}
          <div className="p-4 bg-orange-500/[0.03] border border-orange-500/10 rounded-2xl flex gap-4 items-start">
             <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <Rocket size={18} />
             </div>
             <div>
                <h4 className="text-[13px] font-bold text-white mb-1 tracking-tight">Initialization Ready</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  This sprint will be created in <span className="text-orange-500/80 font-bold uppercase tracking-tighter italic">Planned</span> state. You can then move items from the backlog into this sprint.
                </p>
             </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/[0.05]">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Abort
            </button>
            <Button
              type="submit"
              isLoading={loading}
              className="h-12 px-10 rounded-xl bg-orange-500 text-[#08090a] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all"
            >
              Initialize Sprint
            </Button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default CreateSprintModal;
