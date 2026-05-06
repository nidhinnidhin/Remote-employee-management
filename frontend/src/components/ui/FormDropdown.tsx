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
  variant?: "emerald" | "accent" | "company"; 
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
  variant = "emerald",
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

  // Theme Flags
  const isEmerald = variant === "emerald";
  const isCompany = variant === "company";

  return (
    <div className={cn("mb-0 relative group/dropdown", className)} ref={dropdownRef}>
      <label className={cn(
        "text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] ml-1 mb-2 block transition-colors",
        isEmerald && "group-focus-within/dropdown:text-emerald-500",
        isCompany && "group-focus-within/dropdown:text-[rgb(var(--color-accent))]"
      )}>
        {label} {required && <span className={isEmerald ? "text-emerald-500" : "text-[rgb(var(--color-accent))]"}>*</span>}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full text-left px-4 py-3 transition-all duration-300 flex justify-between items-center rounded-xl outline-none border shadow-lg",
          isEmerald 
            ? "bg-[#040a08] border-emerald-900/30 hover:border-emerald-500/30" 
            : "bg-white/[0.03] border-white/10 hover:border-white/20",
          isOpen && (
            isEmerald 
              ? "border-emerald-500/50 ring-2 ring-emerald-500/10" 
              : "border-[rgb(var(--color-accent))]/50 ring-2 ring-[rgb(var(--color-accent))]/10"
          ),
          error && "border-red-900/50 bg-red-950/10"
        )}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className={cn(
              "transition-colors", 
              isEmerald ? "text-emerald-800" : "text-slate-400"
            )}>
              {icon}
            </div>
          )}
          <span className={cn("text-sm transition-colors", value ? "text-slate-200" : "text-slate-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={16} className={cn("transition-all duration-300", isEmerald ? "text-emerald-800" : "text-slate-500", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full mt-2 py-2 rounded-xl border backdrop-blur-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95",
          isEmerald ? "bg-[#020504] border-emerald-900/40" : "bg-[#0f172a] border-white/10"
        )}>
          {formattedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full text-left px-4 py-2.5 text-[13px] transition-all flex items-center justify-between mx-1 w-[calc(100%-8px)] rounded-lg",
                value === option.value 
                  ? (isEmerald ? "bg-emerald-500/10 text-emerald-400" : "bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]") 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full", 
                  isEmerald 
                    ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" 
                    : "bg-[rgb(var(--color-accent))] shadow-[0_0_10px_rgb(var(--color-accent))]"
                )} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormDropdown;