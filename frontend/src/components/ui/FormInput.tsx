"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormInputProps } from "@/shared/types/ui/form-input.type";

// Extend the type to accept an optional icon
interface ExtendedFormInputProps extends FormInputProps {
  icon?: React.ReactNode;
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
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border ${
            error ? "border-red-400" : "border-gray-200"
          } rounded-lg text-gray-800 placeholder-gray-400 text-sm
          ${icon ? "pl-10" : "pl-4"} pr-${type === "password" ? "10" : "4"} py-3
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 bg-white`}
        />

        {/* Right eye toggle for password */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;