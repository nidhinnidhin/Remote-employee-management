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
      "bg-[rgb(var(--color-btn-primary-bg))] text-[rgb(var(--color-btn-primary-text))] hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50",
    secondary:
      "bg-[rgb(var(--color-btn-secondary-bg))] text-[rgb(var(--color-btn-secondary-text))] hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50",
    outline:
      "border border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-subtle))] active:scale-95 rounded disabled:opacity-50",
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
