"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  label: string;
  value: string;
}

interface FormDropdownProps {
  label: string;
  name: string;
  value?: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  options: string[] | DropdownOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
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
  className,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const formattedOptions: DropdownOption[] = options.map((opt) => 
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption = formattedOptions.find(opt => opt.value === value);

  return (
    <div className={cn("mb-0 relative theme-company group/dropdown", className)} ref={dropdownRef}>
      {/* SaaS Standard Label */}
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 mb-2 block transition-colors group-focus-within/dropdown:text-accent">
        {label} {required && <span className="text-accent">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full text-left px-4 py-3.5 transition-all duration-200 flex justify-between items-center",
          "bg-white/[0.01] border rounded-xl outline-none",
          error 
            ? "border-red-500/40 bg-red-500/[0.01]" 
            : "border-white/10 hover:border-white/20 focus:border-accent/40 bg-white/[0.02]",
          isOpen && "border-accent/40 bg-accent/[0.01] ring-1 ring-accent/10",
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-slate-500 group-hover:text-accent transition-colors">{icon}</div>}
          <span className={cn("text-sm transition-colors", value ? "text-slate-100 font-medium" : "text-slate-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-500 transition-all duration-300",
            isOpen ? "rotate-180 text-accent" : "group-hover:text-slate-300"
          )}
        />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 w-full mt-2 py-1.5",
            "bg-[#0d0e11] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
            "rounded-xl overflow-hidden backdrop-blur-xl custom-scrollbar max-h-60 overflow-y-auto"
          )}
        >
          {formattedOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-500 italic uppercase tracking-widest text-center">
              No options available
            </div>
          ) : (
            formattedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-[13px] transition-all duration-150",
                  "flex items-center justify-between group/item",
                  value === option.value 
                    ? "bg-accent/[0.08] text-accent font-bold" 
                    : "text-slate-400 hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormDropdown;
