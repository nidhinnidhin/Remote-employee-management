"use client";

import { useRef } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  error?: string;
}

const OtpInput = ({ length = 6, value, onChange, error }: OtpInputProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

    pasted.split("").forEach((_, i) => {
      inputsRef.current[i]?.focus();
    });
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
            className={`w-12 h-14 text-center text-xl font-bold bg-neutral-900 border ${error ? "border-red-500" : "border-neutral-700"
              } text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500`}
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
