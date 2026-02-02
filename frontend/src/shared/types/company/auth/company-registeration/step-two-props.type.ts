import { Errors, RegisterFormData } from "./company-registration.type";


export interface StepTwoProps {
  formData: RegisterFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<RegisterFormData>
  >;
  errors: Errors;
  setErrors: React.Dispatch<
    React.SetStateAction<Errors>
  >;
}