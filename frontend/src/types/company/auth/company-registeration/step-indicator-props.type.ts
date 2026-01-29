export interface StepIndicatorProps {
  step: number;
  currentStep: number;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}