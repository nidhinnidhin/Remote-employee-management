"use client";

import { useEffect, useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: string;
}

const OtpInput = ({ length = 6, value, onChange, error }: OtpInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first box when value is externally reset to empty
  useEffect(() => {
    if (value === "") {
      inputsRef.current[0]?.focus();
    }
  }, [value]);

  const handleChange = (index: number, inputValue: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(inputValue)) return;

    const otpArray = value.split("");
    otpArray[index] = inputValue;
    const newOtp = otpArray.join("");

    onChange(newOtp);

    // Move to next input
    if (inputValue && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("Text").slice(0, length);

    if (!/^\d+$/.test(pasted)) return;

    onChange(pasted);

    // Focus the last filled box after paste
    const lastIndex = Math.min(pasted.length, length) - 1;
    setTimeout(() => inputsRef.current[lastIndex]?.focus(), 0);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-14 text-center text-xl font-bold field-input transition-all duration-200 ${
              error ? "border-red-500" : ""
            } focus:outline-none`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
      )}
    </div>
  );
};

export default OtpInput;
