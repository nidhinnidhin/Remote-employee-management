import { Errors, FormData } from "./company-registration.type";

export interface StepOneProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Errors;
  setErrors: React.Dispatch<React.SetStateAction<Errors>>;
}