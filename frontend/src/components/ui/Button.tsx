"use client";

import { ButtonVariant } from "@/shared/types/ui/button-variant.type";
import { ButtonProps } from "@/shared/types/ui/button.type";
import { motion } from "framer-motion";
import React from "react";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) => {
  const baseStyles = "px-6 py-2.5 font-medium transition-all duration-200";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-pink-500 text-white hover:bg-pink-600 active:scale-95 cursor-pointer disabled:opacity-50",
    secondary:
      "bg-neutral-700 text-white hover:bg-neutral-600 active:scale-95 cursor-pointer disabled:opacity-50",
    outline:
      "border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white active:scale-95 rounded disabled:opacity-50",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
