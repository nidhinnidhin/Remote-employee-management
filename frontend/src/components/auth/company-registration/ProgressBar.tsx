"use client";

import { ProgressBarProps } from "@/types/auth/company-registeration/progress-bar-props";
import { motion } from "framer-motion";

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-neutral-700 mb-8">
      <motion.div
        className="h-full bg-red-600"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </div>
  );
};

export default ProgressBar;
