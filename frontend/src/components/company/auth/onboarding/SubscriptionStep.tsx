"use client";

import React, { useState } from "react";
import { Check, Layout, Database, Terminal } from "lucide-react";
import { motion } from "framer-motion";

interface SubscriptionStepProps {
  selectedPlan: string;
  onSelect: (plan: string) => void;
}

const plans = [
  {
    id: "Basic",
    name: "Basic",
    price: "$0",
    description: "For individuals or teams looking to organise any project.",
    features: [
      { icon: Layout, text: "Up to 10 boards per workspace" },
      { icon: Database, text: "Storage (10MB/file)" },
      { icon: Terminal, text: "250 workspace command runs" },
    ],
    perksHeader: "Free includes:",
    perks: ["Unlimited cards", "Custom backgrounds & stickers", "2-factor authentication"],
  },
  {
    id: "Professional",
    name: "Professional",
    price: "$45",
    description: "For teams that need to track and visualise multiple projects.",
    popular: true,
    features: [
      { icon: Layout, text: "Unlimited boards" },
      { icon: Database, text: "Storage (250MB/file)" },
      { icon: Terminal, text: "1000 workspace command runs" },
    ],
    perksHeader: "Everything in Free, plus:",
    perks: ["Advanced checklists", "Custom fields", "Saved searches"],
  },
  {
    id: "Enterprise",
    name: "Enterprise",
    price: "$80",
    description: "For organisations that need to connect work across teams.",
    features: [
      { icon: Layout, text: "Unlimited boards" },
      { icon: Database, text: "Storage (1GB/file)" },
      { icon: Terminal, text: "Unlimited command runs" },
    ],
    perksHeader: "Everything in Professional plus:",
    perks: ["Multi-board management", "Multi-board guests", "Attached permissions"],
  },
];

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({ selectedPlan, onSelect }) => {
  return (
    <div className="w-full py-12 px-4 flex flex-col items-center">
      {/* Container with Flexbox for precise width control */}
      <div className="w-full max-w-[1200px] flex flex-wrap justify-center gap-[3%] items-stretch">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          
          return (
            <motion.div
              key={plan.id}
              onClick={() => onSelect(plan.id)}
              className="flex flex-col p-8 rounded-[32px] border transition-all duration-300 cursor-pointer"
              // Setting width to 27% as requested for the desktop view
              style={{
                width: "min(100%, 28%)", 
                flex: "1 1 300px", // Responsive fallback: grow/shrink but base at 300px
                maxWidth: "340px",
                borderColor: isSelected ? "rgb(var(--color-accent))" : "rgb(var(--color-border-subtle))",
                backgroundColor: "rgb(var(--color-surface-raised))",
                boxShadow: isSelected ? "0 20px 40px rgba(var(--color-accent), 0.1)" : "none",
              }}
            >
              {/* Most Popular Badge */}
              <div className="h-8 mb-2 flex justify-end">
                {plan.popular && (
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                    style={{ backgroundColor: "rgb(var(--color-accent))", color: "rgb(var(--color-bg))" }}>
                    Most popular
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold mb-3" style={{ color: "rgb(var(--color-text-primary))" }}>{plan.name}</h3>
              <p className="text-sm leading-relaxed mb-6 h-10" style={{ color: "rgb(var(--color-text-secondary))" }}>
                {plan.description}
              </p>

              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: "rgb(var(--color-text-primary))" }}>{plan.price}</span>
                <span className="text-sm block mt-1" style={{ color: "rgb(var(--color-text-muted))" }}>per month</span>
              </div>

              <button
                className="w-full py-3 rounded-xl font-bold mb-10 transition-transform active:scale-95"
                style={{
                  backgroundColor: plan.popular ? "rgb(var(--color-accent))" : "rgb(var(--color-text-primary))",
                  color: plan.popular ? "rgb(var(--color-bg))" : "rgb(var(--color-surface-raised))",
                }}
              >
                Get started
              </button>

              {/* Icon Features Section */}
              <div className="space-y-4 mb-8 pt-6 border-t" style={{ borderColor: "rgb(var(--color-border-subtle))" }}>
                {plan.features.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "rgb(var(--color-text-primary))" }}>
                    <item.icon className="w-4 h-4 opacity-70" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Lower Perks List */}
              <div className="mt-auto">
                <p className="text-xs font-bold mb-4 uppercase tracking-wider opacity-80" style={{ color: "rgb(var(--color-text-primary))" }}>
                  {plan.perksHeader}
                </p>
                <ul className="space-y-3">
                  {plan.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "rgb(var(--color-text-secondary))" }}>
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "rgb(var(--color-accent))" }} />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionStep;