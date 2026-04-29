"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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
    <div className={cn("mb-0 relative group/dropdown", className)} ref={dropdownRef}>
      {/* Label - Slate Gray with a hint of Emerald on focus */}
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1 mb-2 block transition-colors group-focus-within/dropdown:text-emerald-500">
        {label} {required && <span className="text-emerald-500">*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full text-left px-4 py-3 transition-all duration-300 flex justify-between items-center",
          "rounded-xl outline-none border shadow-lg",
          // Background: Deep Forest Green | Border: Dark Emerald
          "bg-[#040a08] border-emerald-900/30", 
          "hover:border-emerald-500/30 hover:bg-[#060f0c]",
          error 
            ? "border-red-900/50 bg-red-950/10" 
            : "",
          isOpen && "border-emerald-500/50 ring-2 ring-emerald-500/10 bg-[#060f0c]",
        )}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-emerald-800 group-hover:text-emerald-500 transition-colors">{icon}</div>}
          {/* Selected Text: Light Gray | Placeholder: Muted Gray */}
          <span className={cn(
            "text-sm transition-colors", 
            value ? "text-slate-200 font-medium" : "text-slate-500"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={cn(
            "text-emerald-800 transition-all duration-300",
            isOpen ? "rotate-180 text-emerald-500" : "group-hover:text-emerald-600"
          )}
        />
      </button>

      {isOpen && (
        <div 
          className={cn(
            "absolute z-50 w-full mt-2 py-2 animate-in fade-in zoom-in-95 duration-200",
            // Menu Background: Deepest Black-Green
            "bg-[#020504] border border-emerald-900/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]",
            "rounded-xl overflow-hidden backdrop-blur-xl max-h-60 overflow-y-auto custom-scrollbar"
          )}
        >
          {formattedOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-600 italic uppercase tracking-widest text-center">
              No options
            </div>
          ) : (
            formattedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-[13px] transition-all duration-150",
                  "flex items-center justify-between group/item mx-1 w-[calc(100%-8px)] rounded-lg",
                  value === option.value 
                    ? "bg-emerald-500/10 text-emerald-400 font-semibold" 
                    : "text-slate-400 hover:bg-emerald-500/10 hover:text-white"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                )}
              </button>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="text-red-500/80 text-[10px] font-bold uppercase tracking-wide mt-2 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormDropdown;