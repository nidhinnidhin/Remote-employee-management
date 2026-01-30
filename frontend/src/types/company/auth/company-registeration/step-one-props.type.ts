import { Errors, RegisterFormData } from "./company-registration.type";

export interface StepOneProps {
  formData: RegisterFormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}