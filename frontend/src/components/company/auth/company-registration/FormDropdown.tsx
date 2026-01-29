"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormDropdownProps } from "@/types/company/auth/company-registeration/form-dropdown.type";

const FormDropdown: React.FC<FormDropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select an option",
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="mb-6 relative">
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-neutral-900 border ${
          error ? "border-red-500" : "border-neutral-700"
        } text-left text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 flex justify-between items-center`}
      >
        <span className={value ? "text-white" : "text-neutral-500"}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 max-h-60 overflow-auto shadow-2xl"
          >
            {options.map((option: string) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-3 text-white hover:bg-neutral-700 transition-colors duration-150"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormDropdown;
