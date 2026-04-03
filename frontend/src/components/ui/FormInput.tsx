"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInputProps } from "@/shared/types/ui/form-input.type";

// Extend the type to accept an optional icon
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
    <div className="mb-0">
      {label && (
        <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgb(var(--color-text-secondary))" }}>
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
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
          className={`field-input transition-all duration-200 ${error ? "border-danger" : ""
            } ${icon ? "pl-10" : "pl-4"} pr-${type === "password" ? "10" : "4"} py-3.5`}
        />

        {/* Right eye toggle for password */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;