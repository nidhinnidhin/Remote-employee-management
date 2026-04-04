"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Update the local interface or the imported one
interface FormDropdownProps {
  label: string;
  name: string;
  value?: string; // Change to optional
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: string[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

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
    <div className="mb-0 relative theme-company">
      {/* SaaS Standard Label */}
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block">
        {label} {required && <span className="text-accent">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`field-input text-left px-4 py-3.5 transition-all duration-300 flex justify-between items-center group ${
          error ? "border-red-500/50" : "border-white/10 hover:border-accent/40"
        }`}
      >
        <span className={value ? "text-white" : "text-slate-500"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 text-slate-500 group-hover:text-accent ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close when clicking outside */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-[rgb(var(--color-surface-raised))] border border-white/10 max-h-60 overflow-auto shadow-2xl rounded-xl custom-scrollbar"
            >
              {options.map((option: string) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-300 hover:bg-accent hover:text-[#08090a] transition-all duration-150 first:rounded-t-xl last:rounded-b-xl"
                >
                  {option}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-1.5 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormDropdown;
