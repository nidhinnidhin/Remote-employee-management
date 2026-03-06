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
    },
    {
        id: "Professional",
        name: "Professional",
        price: "$49/mo",
        description: "Best for growing teams",
        icon: Zap,
        features: ["Unlimited Employees", "Advanced Analytics", "Priority Support"],
        popular: true,
    },
    {
        id: "Enterprise",
        name: "Enterprise",
        price: "Custom",
        description: "Scale with confidence",
        icon: Shield,
        features: ["SSO & Security", "Dedicated Manager", "Custom Integration"],
    },
];

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ selectedPlan, onSelect }) => {
    return (
        <div>
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-1.5" style={{ color: "rgb(var(--color-text-primary))" }}>
                    Select a Plan
                </h2>
                <p className="text-sm" style={{ color: "rgb(var(--color-text-secondary))" }}>
                    Choose the perfect scale for your organization
                </p>
            </div>

            {/* Plan cards — single column stack */}
            <div className="space-y-3">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const Icon = plan.icon;

                    return (
                        <motion.div
                            key={plan.id}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => onSelect(plan.id)}
                            className="relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                            style={{
                                borderColor: isSelected
                                    ? "rgb(var(--color-accent))"
                                    : "rgb(var(--color-border-subtle))",
                                backgroundColor: isSelected
                                    ? "rgba(var(--color-accent), 0.06)"
                                    : "rgb(var(--color-surface-raised))",
                            }}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <span
                                    className="absolute -top-2.5 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
                                    style={{
                                        backgroundColor: "rgb(var(--color-accent))",
                                        color: "rgb(var(--color-bg))",
                                    }}
                                >
                                    Most Popular
                                </span>
                            )}

                            {/* Icon */}
                            <div
                                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                                style={{ backgroundColor: "rgb(var(--color-accent-subtle))" }}
                            >
                                <Icon className="w-4 h-4" style={{ color: "rgb(var(--color-accent))" }} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-sm" style={{ color: "rgb(var(--color-text-primary))" }}>
                                        {plan.name}
                                    </span>
                                    <span className="font-bold text-sm" style={{ color: "rgb(var(--color-accent))" }}>
                                        {plan.price}
                                    </span>
                                </div>
                                <p className="text-xs mb-2" style={{ color: "rgb(var(--color-text-muted))" }}>
                                    {plan.description}
                                </p>
                                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-1 text-xs" style={{ color: "rgb(var(--color-text-secondary))" }}>
                                            <Check className="w-3 h-3 flex-shrink-0" style={{ color: "rgb(var(--color-accent))" }} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Radio indicator */}
                            <div
                                className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5"
                                style={{
                                    borderColor: isSelected ? "rgb(var(--color-accent))" : "rgb(var(--color-border-subtle))",
                                }}
                            >
                                {isSelected && (
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: "rgb(var(--color-accent))" }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer note */}
            <div
                className="mt-5 flex items-center justify-center gap-2 py-3 px-4 rounded-xl"
                style={{
                    backgroundColor: "rgb(var(--color-surface-raised))",
                    border: "1px solid rgb(var(--color-border-subtle))",
                }}
            >
                <CreditCard className="w-4 h-4 flex-shrink-0" style={{ color: "rgb(var(--color-accent))" }} />
                <span className="text-xs" style={{ color: "rgb(var(--color-text-secondary))" }}>
                    No credit card required for your 14-day free trial
                </span>
            </div>
        </div>
    );
};

export default SubscriptionStep;
