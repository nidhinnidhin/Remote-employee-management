"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInputProps } from "@/shared/types/ui/form-input.type";
import { cn } from "@/lib/utils";

interface ExtendedFormInputProps extends FormInputProps {
  icon?: React.ReactNode;
  step?: string;
  min?: string;
}

const FormInput: React.FC<ExtendedFormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  icon,
  step,
  min,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 block">
          {label} {required && <span className="text-accent">*</span>}
        </label>
      )}

      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors duration-300">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          min={min}
          className={cn(
            "field-input w-full px-4 py-2.5 text-sm transition-all duration-300",
            "bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white",
            "placeholder:text-slate-700 focus:border-accent/40 focus:bg-accent/[0.01]",
            icon ? "pl-11" : "pl-4",
            type === "password" ? "pr-11" : "pr-4",
            error ? "border-red-500/50 focus:border-red-500" : "",
          )}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-accent transition-colors p-1"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-[10px] font-bold uppercase tracking-tight mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
