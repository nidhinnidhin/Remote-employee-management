"use client";

import { motion } from "framer-motion";
import React from "react";
import { ButtonProps } from "@/shared/types/ui/button.type";
import { ButtonVariant } from "@/shared/types/ui/button-variant.type";


const LoginButton: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "px-6 py-2.5 font-medium transition-all duration-200 flex items-center justify-center gap-2";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[rgb(var(--color-accent))] text-white hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-[rgb(var(--color-btn-secondary-bg))] text-[rgb(var(--color-btn-secondary-text))] hover:bg-[rgb(var(--color-bg-subtle))] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "bg-transparent border border-[rgb(var(--color-border-subtle))] text-primary hover:bg-[rgb(var(--color-bg-subtle))] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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

export default LoginButton;
