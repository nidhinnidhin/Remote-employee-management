import { ReactNode } from "react";

export interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  className?: string; 
}