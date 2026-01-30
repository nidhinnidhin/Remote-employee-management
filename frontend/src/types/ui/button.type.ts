import React from "react";
import { ButtonVariant } from "./button-variant.type";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}