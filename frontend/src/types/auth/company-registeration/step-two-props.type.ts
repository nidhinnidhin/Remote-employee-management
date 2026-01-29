import { Errors, FormData } from "./company-registration.type";

export interface StepTwoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}

export interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}