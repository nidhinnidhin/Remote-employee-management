"use client";

import { ButtonVariant } from "@/shared/types/ui/button-variant.type";
import { ButtonProps } from "@/shared/types/ui/button.type";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  isLoading = false,
  type = "button",
  className = "",
  title,
}) => {
  const baseStyles = "px-6 py-2.5 font-medium transition-all duration-200";

  const variants: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    danger: "btn-danger",
    outline:
      "border border-[rgb(var(--color-accent))] text-[rgb(var(--color-accent))] hover:bg-[rgb(var(--color-accent-subtle))] active:scale-95 rounded-xl disabled:opacity-50",
  };

  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      className={`${baseStyles} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={15} className="animate-spin" />
          {children}
        </span>
      ) : children}
    </motion.button>
  );
};

export default Button;
