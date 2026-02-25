"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FormDropdownProps } from "@/shared/types/company/auth/company-registeration/form-dropdown.type";

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
      <label className="block text-sm font-medium text-secondary mb-2">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`field-input text-left px-4 py-3 transition-all duration-200 flex justify-between items-center ${error ? "border-danger" : ""
          }`}
      >
        <span className={value ? "text-primary" : "text-muted"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 text-muted ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 portal-card-inner max-h-60 overflow-auto shadow-2xl rounded-lg border border-gray-100"
            style={{ borderColor: "rgb(var(--color-border-subtle))" }}
          >
            {options.map((option: string) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left px-4 py-3 text-primary hover:bg-[rgb(var(--color-bg-subtle))] transition-colors duration-150"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormDropdown;
