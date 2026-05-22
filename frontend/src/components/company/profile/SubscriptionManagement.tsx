"use client";

import React, { useState, useEffect } from "react";
import { Check, Loader2, Sparkles, AlertCircle, CreditCard, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { 
  getSubscriptionPlansAction, 
  getCurrentSubscriptionAction,
  createPaymentOrderAction,
  verifyPaymentAction
} from "@/actions/company/subscription/payment.actions";
import { SubscriptionPlan } from "@/shared/types/superadmin/subscription/subscription.type";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile.store";

interface SubscriptionManagementProps {
  companyId: string;
  userId: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ 
  companyId, 
  userId 
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    loadRazorpayScript();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plansResult, currentResult] = await Promise.all([
        getSubscriptionPlansAction(true),
        getCurrentSubscriptionAction(companyId)
      ]);

      if (plansResult.success) {
        setPlans(plansResult.data || []);
      }
      if (currentResult.success) {
        setCurrentSubscription(currentResult.data);
      }
    } catch (error) {
      toast.error("Failed to load subscription data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setSelectedPlanId(plan.id);
    setIsProcessing(true);

    try {
      const orderResult = await createPaymentOrderAction(plan.id, companyId);
      
      if (!orderResult.success) {
        toast.error(orderResult.error || "Failed to initiate payment");
        setIsProcessing(false);
        return;
      }

      if (orderResult.data.isFree) {
        const verifyResult = await verifyPaymentAction({
          planId: plan.id,
          companyId,
          userId,
          isFree: true
        });
        
        if (verifyResult.success) {
          toast.success("Plan updated successfully!");
          await loadData();
        } else {
          toast.error(verifyResult.error || "Failed to activate plan");
        }
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResult.data.order.amount,
        currency: orderResult.data.order.currency,
        name: "Employee Management",
        description: `Upgrade to ${plan.name}`,
        order_id: orderResult.data.order.id,
        handler: async (response: any) => {
          const verifyResult = await verifyPaymentAction({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            planId: plan.id,
            companyId,
            userId
          });

          if (verifyResult.success) {
            toast.success("Upgrade successful!");
            await loadData();
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#8B5CF6" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong during payment");
    } finally {
      setIsProcessing(false);
      setSelectedPlanId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-slate-400 font-medium">Loading subscription details...</p>
      </div>
    );
  }

  const currentPlan = currentSubscription?.plan;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Current Subscription Status */}
      {currentSubscription && (
        <div className="relative overflow-hidden rounded-3xl bg-surface-raised border border-white/5 p-8">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Zap size={120} className="text-accent" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Current Plan</h3>
                  <p className="text-2xl font-black text-white">{currentPlan?.name}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-500" />
                  <span>Expires: {currentSubscription.endDate ? new Date(currentSubscription.endDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-green-500 font-bold uppercase tracking-tight">Active Status</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plan Limits</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Max Projects</p>
                  <p className="text-lg font-black text-white">{currentPlan?.maxProjects === -1 ? 'Unlimited' : currentPlan?.maxProjects}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Max Members</p>
                  <p className="text-lg font-black text-white">{currentPlan?.maxMembers === -1 ? 'Unlimited' : currentPlan?.maxMembers}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-white mb-2">Available Plans</h2>
          <p className="text-slate-400 text-sm">Upgrade your account to unlock more features and higher limits.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentPlan?.id === plan.id;
            const isUpgrade = currentPlan ? plan.price > currentPlan.price : plan.price > 0;
            const isDegrade = currentPlan ? plan.price < currentPlan.price : false;
            const isPopular = plan.type === 'PRO';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col p-8 rounded-[32px] border transition-all duration-500 relative overflow-hidden ${
                  isCurrent ? 'ring-2 ring-accent border-transparent bg-accent/[0.03]' : 'border-white/5 bg-surface-raised'
                }`}
              >
                {isPopular && !isCurrent && (
                  <div className="absolute top-0 right-0 p-4">
                    <div className="bg-accent text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-lg shadow-accent/20">
                      <Sparkles size={10} />
                      Recommended
                    </div>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-0 right-0 p-4">
                    <div className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1 border border-green-500/20">
                      <Check size={10} />
                      Current Plan
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹{plan.price}</span>
                    <span className="text-sm text-slate-500">/month</span>
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-8 min-h-[40px] line-clamp-2">
                  {plan.description}
                </p>

                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.slice(0, 5).map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-accent" strokeWidth={3} />
                      </div>
                      <span className="truncate">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  disabled={isCurrent || isDegrade || (isProcessing && selectedPlanId === plan.id)}
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isCurrent 
                      ? 'bg-white/5 text-slate-500 cursor-default' 
                      : isDegrade 
                        ? 'bg-white/5 text-slate-700 cursor-not-allowed'
                        : 'bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/10'
                  }`}
                >
                  {isProcessing && selectedPlanId === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrent ? (
                    "Active"
                  ) : isDegrade ? (
                    "Unavailable"
                  ) : (
                    "Upgrade Now"
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
