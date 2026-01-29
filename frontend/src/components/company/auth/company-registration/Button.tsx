"use client";

import {
  ButtonProps,
  ButtonVariant,
} from "@/types/components/button.types";
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
      "bg-red-600 text-white hover:bg-red-700 active:scale-95 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-neutral-700 text-white hover:bg-neutral-600 active:scale-95 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
