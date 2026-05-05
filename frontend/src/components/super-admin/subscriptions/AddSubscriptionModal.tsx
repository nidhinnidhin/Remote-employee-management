"use client";

import React, { useState } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import { 
  SubscriptionPlanType, 
  CreateSubscriptionPlanDto 
} from "@/shared/types/superadmin/subscription/subscription.type";
import { Loader2, Plus, X } from "lucide-react";

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionPlanDto) => Promise<boolean>;
  isSubmitting: boolean;
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<CreateSubscriptionPlanDto>({
    name: "",
    type: SubscriptionPlanType.FREE,
    price: 0,
    description: "",
    features: [],
    isActive: true,
  });

  const [currentFeature, setCurrentFeature] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof CreateSubscriptionPlanDto, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addFeature = () => {
    if (!currentFeature.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, currentFeature.trim()],
    }));
    setCurrentFeature("");
    if (errors.features) {
      setErrors((prev) => ({ ...prev, features: "" }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    if (!formData.description) newErrors.description = "Description is required";
    if (formData.features.length === 0) newErrors.features = "At least one feature is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        name: "",
        type: SubscriptionPlanType.FREE,
        price: 0,
        description: "",
        features: [],
        isActive: true,
      });
      setCurrentFeature("");
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Subscription Plan"
      description="Add a new billing plan for your workspaces."
      theme="theme-super"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">
              Plan Type <span className="text-accent">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white focus:border-accent/40 focus:bg-accent/[0.01] transition-all duration-300"
            >
              <option value={SubscriptionPlanType.FREE}>FREE</option>
              <option value={SubscriptionPlanType.PRO}>PRO</option>
              <option value={SubscriptionPlanType.ENTERPRISE}>ENTERPRISE</option>
            </select>
          </div>
        </div>

        <FormInput
          label="Price (USD)"
          name="price"
          type="number"
          value={formData.price.toString()}
          onChange={handleChange}
          placeholder="0.00"
          error={errors.price}
          required
        />

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">
            Description <span className="text-accent">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the plan..."
            className="w-full px-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white focus:border-accent/40 focus:bg-accent/[0.01] transition-all duration-300 min-h-[80px]"
          />
          {errors.description && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">
            Plan Features <span className="text-accent">*</span>
          </label>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                placeholder="e.g. Upto 10 Projects"
                className="w-full px-4 py-2.5 text-sm bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white focus:border-accent/40 focus:bg-accent/[0.01] transition-all duration-300"
              />
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all flex items-center justify-center aspect-square"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-accent-light text-sm group"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-0.5 hover:bg-accent/20 rounded-md transition-all text-accent group-hover:text-red-400"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {errors.features && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">
              {errors.features}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
            className="px-6 py-2.5 rounded-xl bg-[rgb(var(--color-accent))] text-white font-semibold hover:brightness-110 transition-all flex items-center gap-2"
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
