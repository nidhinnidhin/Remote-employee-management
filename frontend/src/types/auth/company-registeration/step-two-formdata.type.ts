export interface StepTwoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export type StepTwoErrors = Partial<Record<keyof StepTwoFormData, string>>;