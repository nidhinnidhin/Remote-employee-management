"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  placeholder?: string;
}


const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputType =
    type === "password" && showPassword ? "text" : type;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-neutral-900 border ${
            error ? "border-red-500" : "border-neutral-700"
          } text-white px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
