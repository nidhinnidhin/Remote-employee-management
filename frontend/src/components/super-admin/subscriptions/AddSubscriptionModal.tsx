"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import {
  SubscriptionPlanType,
  CreateSubscriptionPlanDto,
} from "@/shared/types/superadmin/subscription/subscription.type";
import { Loader2, Plus, X, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionPlanDto) => Promise<boolean>;
  isSubmitting: boolean;
}

const INITIAL_STATE: CreateSubscriptionPlanDto = {
  name: "",
  type: SubscriptionPlanType.FREE,
  price: 0,
  description: "",
  features: [],
  maxProjects: 5,
  maxMembers: 5,
  isActive: true,
};

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] =
    useState<CreateSubscriptionPlanDto>(INITIAL_STATE);
  const [unlimitedProjects, setUnlimitedProjects] = useState(false);
  const [unlimitedMembers, setUnlimitedMembers] = useState(false);
  const [extraFeature, setExtraFeature] = useState("");
  const [extraFeatures, setExtraFeatures] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? value === ""
            ? 0
            : parseFloat(value)
          : name === "maxProjects" || name === "maxMembers"
            ? parseInt(value) || 1
            : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addExtraFeature = () => {
    if (!extraFeature.trim()) return;
    setExtraFeatures((prev) => [...prev, extraFeature.trim()]);
    setExtraFeature("");
  };

  const removeExtraFeature = (index: number) => {
    setExtraFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Plan name is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!unlimitedProjects && (formData.maxProjects ?? 0) < 1)
      newErrors.maxProjects = "Must be at least 1";
    if (!unlimitedMembers && (formData.maxMembers ?? 0) < 1)
      newErrors.maxMembers = "Must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildFeatures = (): string[] => {
    const features: string[] = [];
    // Auto-generate project feature
    features.push(
      unlimitedProjects
        ? "Unlimited Projects"
        : `Upto ${formData.maxProjects} Projects`,
    );
    // Auto-generate member feature
    features.push(
      unlimitedMembers
        ? "Unlimited Members"
        : `Upto ${formData.maxMembers} Members`,
    );
    // Always include Basic Support
    features.push("Basic Support");
    // Append any extras the admin added
    features.push(...extraFeatures);
    return features;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: CreateSubscriptionPlanDto = {
      ...formData,
      maxProjects: unlimitedProjects ? -1 : (formData.maxProjects ?? 5),
      maxMembers: unlimitedMembers ? -1 : (formData.maxMembers ?? 5),
      features: buildFeatures(),
    };

    const success = await onSubmit(payload);
    if (success) {
      setFormData(INITIAL_STATE);
      setUnlimitedProjects(false);
      setUnlimitedMembers(false);
      setExtraFeature("");
      setExtraFeatures([]);
      setErrors({});
      onClose();
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white focus:border-accent/40 focus:bg-accent/[0.01] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";

  const labelClass =
    "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Subscription Plan"
      description="Configure the plan limits — features are generated automatically."
      theme="theme-super"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Plan Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Professional"
            error={errors.name}
            required
          />

          <div className="space-y-1.5">
            <label className={labelClass}>
              Plan Type <span className="text-accent">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={cn(
                inputClass,
                "text-white font-semibold cursor-pointer outline-none", // Modified styles
              )}
            >
              <option
                value={SubscriptionPlanType.FREE}
                className="bg-[#08090a] text-slate-200"
              >
                BASIC
              </option>
              <option
                value={SubscriptionPlanType.PRO}
                className="bg-[#08090a] text-slate-200"
              >
                PRO
              </option>
              <option
                value={SubscriptionPlanType.ENTERPRISE}
                className="bg-[#08090a] text-slate-200"
              >
                ENTERPRISE
              </option>
            </select>
          </div>
        </div>

        <FormInput
          label="Price (₹/month)"
          name="price"
          type="number"
          value={formData.price.toString()}
          onChange={handleChange}
          placeholder="0 for free plan"
          error={errors.price}
          required
        />

        {/* Description */}
        <div className="space-y-1.5">
          <label className={labelClass}>
            Description <span className="text-accent">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this plan..."
            className={`${inputClass} min-h-[72px] resize-none`}
          />
          {errors.description && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Limits Section */}
        <div className="rounded-2xl  bg-white/[0.02] p-5 space-y-5">
          <p className={`${labelClass} mb-0`}>Plan Limits</p>

          {/* Max Projects */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`${labelClass} mb-0`}>Max Projects</label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setUnlimitedProjects((p) => !p)}
                  className={`w-9 h-5 rounded-full transition-colors ${unlimitedProjects ? "bg-accent" : "bg-white/10"} relative`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${unlimitedProjects ? "left-[18px]" : "left-0.5"}`}
                  />
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Infinity size={12} /> Unlimited
                </span>
              </label>
            </div>
            <input
              type="number"
              name="maxProjects"
              min={1}
              value={formData.maxProjects ?? 5}
              onChange={handleChange}
              disabled={unlimitedProjects}
              className={inputClass}
              placeholder="e.g. 10"
            />
            {!unlimitedProjects && errors.maxProjects && (
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight ml-1">
                {errors.maxProjects}
              </p>
            )}
            <p className="text-[11px] text-gray-500 ml-1">
              Will generate:{" "}
              <span className="text-accent font-semibold">
                {unlimitedProjects
                  ? "Unlimited Projects"
                  : `Upto ${formData.maxProjects} Projects`}
              </span>
            </p>
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={`${labelClass} mb-0`}>Max Members</label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setUnlimitedMembers((p) => !p)}
                  className={`w-9 h-5 rounded-full transition-colors ${unlimitedMembers ? "bg-accent" : "bg-white/10"} relative`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${unlimitedMembers ? "left-[18px]" : "left-0.5"}`}
                  />
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Infinity size={12} /> Unlimited
                </span>
              </label>
            </div>
            <input
              type="number"
              name="maxMembers"
              min={1}
              value={formData.maxMembers ?? 5}
              onChange={handleChange}
              disabled={unlimitedMembers}
              className={inputClass}
              placeholder="e.g. 20"
            />
            {!unlimitedMembers && errors.maxMembers && (
              <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight ml-1">
                {errors.maxMembers}
              </p>
            )}
            <p className="text-[11px] text-gray-500 ml-1">
              Will generate:{" "}
              <span className="text-accent font-semibold">
                {unlimitedMembers
                  ? "Unlimited Members"
                  : `Upto ${formData.maxMembers} Members`}
              </span>
            </p>
          </div>
        </div>

        {/* Extra Features */}
        <div className="space-y-3">
          <label className={labelClass}>
            Additional Features{" "}
            <span className="text-gray-600">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={extraFeature}
              onChange={(e) => setExtraFeature(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addExtraFeature())
              }
              placeholder="e.g. Priority Email Support"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addExtraFeature}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center aspect-square"
            >
              <Plus size={20} />
            </button>
          </div>

          {extraFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {extraFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm group"
                >
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeExtraFeature(index)}
                    className="p-0.5 hover:bg-white/10 rounded-md transition-all group-hover:text-red-400"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[rgb(var(--color-accent))] text-white font-semibold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Plan"
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

export default AddSubscriptionModal;
