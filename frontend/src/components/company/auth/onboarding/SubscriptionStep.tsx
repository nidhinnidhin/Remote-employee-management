"use client";

import React from "react";
import { Check, CreditCard, Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface SubscriptionStepProps {
    selectedPlan: string;
    onSelect: (plan: string) => void;
}

const plans = [
    {
        id: "Starter",
        name: "Starter",
        price: "Free",
        description: "Perfect for exploring",
        icon: Sparkles,
        features: ["Up to 10 Employees", "Basic Analytics", "Standard Support"],
        color: "bg-blue-500"
    },
    {
        id: "Professional",
        name: "Professional",
        price: "$49",
        description: "Best for growing teams",
        icon: Zap,
        features: ["Unlimited Employees", "Advanced Analytics", "Priority Support", "Custom Branding"],
        color: "bg-accent",
        popular: true
    },
    {
        id: "Enterprise",
        name: "Enterprise",
        price: "Custom",
        description: "Scale with confidence",
        icon: Shield,
        features: ["SSO & Security", "Dedicated Manager", "SLA Guarantee", "Custom Integration"],
        color: "bg-purple-500"
    }
];

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ selectedPlan, onSelect }) => {
    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">Select a Plan</h2>
                <p className="text-secondary mt-2 text-lg">Choose the perfect scale for your organization</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const Icon = plan.icon;

                    return (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(plan.id)}
                            className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col ${isSelected
                                    ? 'border-accent bg-accent/5 shadow-2xl shadow-accent/10'
                                    : 'border-border-subtle bg-bg-card hover:border-accent/30'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className={`p-3 rounded-2xl w-fit mb-4 ${plan.color} bg-opacity-10`}>
                                <Icon className={`w-6 h-6 ${isSelected ? 'text-accent' : 'text-primary'}`} />
                            </div>

                            <h3 className="text-xl font-bold text-primary mb-1">{plan.name}</h3>
                            <p className="text-xs text-muted mb-4 line-clamp-1">{plan.description}</p>

                            <div className="mb-6">
                                <span className="text-3xl font-black text-primary">{plan.price}</span>
                                {plan.price !== "Free" && plan.price !== "Custom" && <span className="text-sm text-muted">/mo</span>}
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-xs text-secondary font-medium leading-tight">
                                        <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className={`w-full py-2.5 rounded-xl text-center text-xs font-bold transition-all ${isSelected
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'bg-bg-subtle text-muted group-hover:bg-accent/10'
                                }`}>
                                {isSelected ? "Plan Selected" : "Select Plan"}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="p-4 rounded-2xl bg-bg-subtle border border-border-subtle flex items-center justify-center gap-3">
                <CreditCard className="w-5 h-5 text-accent" />
                <span className="text-xs font-semibold text-secondary">No credit card required for your 14-day free trial</span>
            </div>
        </div>
    );
};

export default SubscriptionStep;
