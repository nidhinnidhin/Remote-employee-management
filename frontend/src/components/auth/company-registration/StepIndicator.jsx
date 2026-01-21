'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const StepIndicator = ({ step, currentStep, label, icon: Icon }) => {
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          isCompleted
            ? 'bg-red-600 border-red-600'
            : isActive
            ? 'bg-transparent border-red-600'
            : 'bg-transparent border-neutral-600'
        }`}
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <Check className="text-white" size={24} />
        ) : (
          <Icon className={isActive ? 'text-red-600' : 'text-neutral-500'} size={24} />
        )}
      </motion.div>
      <p
        className={`mt-2 text-sm font-medium ${
          isActive ? 'text-white' : 'text-neutral-500'
        }`}
      >
        {label}
      </p>
    </div>
  );
};

export default StepIndicator;