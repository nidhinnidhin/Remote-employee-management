export interface StepTwoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type StepTwoErrors = Partial<Record<keyof StepTwoFormData, string>>;