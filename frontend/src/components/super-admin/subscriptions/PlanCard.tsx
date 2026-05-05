"use client";

import { Trash2, Check } from "lucide-react";
import { SubscriptionPlan } from "@/shared/types/superadmin/subscription/subscription.type";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, currentStatus: boolean) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onDelete,
  onToggleStatus,
}) => {
  const { id, name, price, description, features, isActive } = plan;

  return (
    <div className="group relative flex flex-col p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] transition-all duration-300 hover:border-[rgb(var(--color-accent))]/50 hover:shadow-[0_0_20px_rgba(var(--color-accent),0.1)]">
      {/* Plan Name & Price */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-3xl font-bold text-white">₹{price}</span>
            <span className="text-sm text-gray-400">/mo</span>
          </div>
          <h3 className={`text-xl font-bold tracking-wider mb-2 ${
            name === "FREE" ? "text-white" : "text-[rgb(var(--color-accent))]"
          }`}>
            {name}
          </h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>

        {onDelete && (
          <button 
            onClick={() => onDelete(id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Features List */}
      <div className="flex-1 space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[rgb(var(--color-accent))]/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-[rgb(var(--color-accent))]" strokeWidth={3} />
            </div>
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* Active Indicator / Toggle */}
      <div className="pt-6 border-t border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onToggleStatus?.(id, isActive)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
              isActive ? "bg-[rgb(var(--color-accent))]" : "bg-[#333]"
            }`}
          >
            <div className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
              isActive ? "translate-x-5" : ""
            }`} />
          </button>
          <span className="text-sm font-medium text-gray-400">Active</span>
        </div>
      </div>

      {/* Hover Background Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-accent))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
