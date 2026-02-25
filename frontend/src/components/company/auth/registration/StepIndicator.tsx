"use client";

import { StepIndicatorProps } from "@/shared/types/company/auth/company-registeration/step-indicator-props.type";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import React from "react";

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  currentStep,
  label,
  icon: Icon,
}) => {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300"
        style={{
          backgroundColor: isCompleted
            ? "rgb(var(--color-accent))"
            : "transparent",
          borderColor:
            isCompleted || isActive
              ? "rgb(var(--color-accent))"
              : "rgb(var(--color-border))",
          boxShadow: isCompleted
            ? "0 0 15px rgb(var(--color-accent) / 0.5)"
            : isActive
              ? "0 0 10px rgb(var(--color-accent) / 0.3)"
              : "none",
        }}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check
            size={22}
            style={{ color: "rgb(var(--color-text-inverse))" }}
          />
        ) : (
          <Icon size={22} className={isActive ? "text-accent" : "text-muted"} />
        )}
      </motion.div>

      <p
        className="mt-2 text-sm font-medium transition-colors"
        style={{
          color: isActive
            ? "rgb(var(--color-text-primary))"
            : "rgb(var(--color-text-muted))",
        }}
      >
        {label}
      </p>
    </div>
  );
};

export default StepIndicator;
