"use client";

import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { PlanCard } from "./PlanCard";
import AddSubscriptionModal from "./AddSubscriptionModal";
import { useSubscriptionPlans } from "@/hooks/super-admin/subscription/useSubscriptionPlans";

export const SubscriptionPlans: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { 
    plans, 
    isLoading, 
    isSubmitting, 
    handleCreatePlan, 
    handleDeletePlan,
    handleUpdatePlan 
  } = useSubscriptionPlans();

  const onToggleStatus = async (id: string, currentStatus: boolean) => {
    await handleUpdatePlan(id, { isActive: !currentStatus });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Subscription Plans
          </h1>
          <p className="text-gray-400 text-lg">
            Manage billing plans and features for workspaces.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[rgb(var(--color-accent))] hover:brightness-110 text-white font-semibold rounded-lg transition-all active:scale-95 shadow-[0_4px_15px_rgba(var(--color-accent),0.3)]"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-[rgb(var(--color-accent))] animate-spin" />
          <p className="text-gray-500 font-medium">Loading subscription plans...</p>
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onDelete={handleDeletePlan}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
          <p className="text-gray-500">No subscription plans found. Create your first one!</p>
        </div>
      )}

      {/* Add Plan Modal */}
      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePlan}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
