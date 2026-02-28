"use client";

import { ProgressBarProps } from "@/shared/types/company/auth/company-registeration/progress-bar-props.type";
import { motion } from "framer-motion";

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div
      className="w-full h-2 mb-8 rounded-full overflow-hidden"
      style={{
        backgroundColor: "rgb(var(--color-border-subtle))",
      }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          backgroundColor: "rgb(var(--color-accent))",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ProgressBar;