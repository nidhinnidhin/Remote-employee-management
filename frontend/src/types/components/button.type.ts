import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}