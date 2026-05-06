import React, { useState, useEffect } from "react";
import { Check, Layout, Database, Terminal, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getSubscriptionPlansAction } from "@/actions/super-admin/subscription/subscription.actions";
import { createPaymentOrderAction, verifyPaymentAction } from "@/actions/company/subscription/payment.actions";
import { SubscriptionPlan } from "@/shared/types/superadmin/subscription/subscription.type";
import { toast } from "sonner";

interface SubscriptionStepProps {
  selectedPlan: string;
  onSelect: (planId: string, planName: string) => void;
  companyId: string;
  userId: string;
  onPaymentSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ 
  selectedPlan, 
  onSelect, 
  companyId, 
  userId,
  onPaymentSuccess 
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPlans();
    loadRazorpayScript();
  }, []);

  const loadPlans = async () => {
    try {
      const result = await getSubscriptionPlansAction(true); // only active plans
      if (result.success) {
        setPlans(result.data || []);
      }
    } catch (error) {
      toast.error("Failed to load subscription plans");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    if (window.Razorpay) return; // Already loaded

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      toast.error("Failed to load payment gateway. Please check your internet or disable ad-blockers.");
    };
    document.body.appendChild(script);
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    onSelect(plan.id, plan.name);
    setIsProcessing(true);

    try {
      const orderResult = await createPaymentOrderAction(plan.id, companyId);
      
      if (!orderResult.success) {
        toast.error(orderResult.error || "Failed to initiate payment");
        setIsProcessing(false);
        return;
      }

      if (orderResult.data.isFree) {
        // Handle Free Plan Activation
        const verifyResult = await verifyPaymentAction({
          planId: plan.id,
          companyId,
          userId,
          isFree: true
        });
        
        if (verifyResult.success) {
          toast.success("Free plan activated!");
          onPaymentSuccess();
        } else {
          toast.error(verifyResult.error || "Failed to activate free plan");
        }
        setIsProcessing(false);
        return;
      }

      // Handle Razorpay Payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderResult.data.order.amount,
        currency: orderResult.data.order.currency,
        name: "Employee Management",
        description: `Subscription: ${plan.name}`,
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
            toast.success("Payment successful!");
            onPaymentSuccess();
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#8B5CF6", // Violet/Accent color
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong during payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[rgb(var(--color-accent))] animate-spin" />
        <p className="text-gray-400 font-medium">Loading premium plans...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-6 px-4 flex flex-col items-center">
      <div className="text-center mb-12 space-y-3">
        <h2 className="text-3xl font-black text-white">Choose Your Power</h2>
        <p className="text-gray-400">Scale your organization with our premium tools.</p>
      </div>

      <div className="w-full max-w-[1200px] flex flex-wrap justify-center gap-6 items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isPro = plan.type === 'PRO';
          
          return (
            <motion.div
              key={plan.id}
              className="flex flex-col p-8 rounded-[32px] border transition-all duration-500 relative overflow-hidden"
              style={{
                width: "min(100%, 31%)", 
                flex: "1 1 320px",
                maxWidth: "360px",
                borderColor: isSelected ? "rgb(var(--color-accent))" : "rgb(var(--color-border-subtle))",
                backgroundColor: "rgb(var(--color-surface-raised))",
                boxShadow: isSelected ? "0 25px 50px -12px rgba(var(--color-accent), 0.25)" : "none",
              }}
            >
              {isPro && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="bg-[rgb(var(--color-accent))] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                    <Sparkles size={10} />
                    Popular
                  </div>
                </div>
              )}

              <h3 className="text-xl font-black mb-1 uppercase tracking-wider" style={{ color: isPro ? "rgb(var(--color-accent))" : "white" }}>
                {plan.name}
              </h3>
              <p className="text-xs font-medium text-gray-500 mb-6 uppercase tracking-tight">
                {plan.type} Edition
              </p>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">₹{plan.price}</span>
                <span className="text-sm text-gray-400">/mo</span>
              </div>

              <p className="text-sm text-gray-400 mb-8 min-h-[40px]">
                {plan.description}
              </p>

              <button
                disabled={isProcessing}
                onClick={() => handleSubscribe(plan)}
                className="w-full py-4 rounded-2xl font-black text-sm mb-10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group"
                style={{
                  backgroundColor: isPro ? "rgb(var(--color-accent))" : "white",
                  color: isPro ? "white" : "black",
                }}
              >
                {isProcessing && isSelected ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{plan.price === 0 ? "Select Plan" : "Subscribe Now"}</span>
                  </>
                )}
              </button>

              <div className="space-y-4 pt-8 border-t border-white/5">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[rgb(var(--color-accent))]" strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionStep;