import {
  CompanyRegistrationFormData,
  FormErrors,
} from "@/src/types/auth/company-registeration/company-registration.types";

export function validateField(
  name: keyof CompanyRegistrationFormData,
  value: string,
  formData: CompanyRegistrationFormData,
): string {
  switch (name) {
    case "companyName":
      if (!value.trim()) return "Company name is required";
      if (value.length < 2) return "Company name must be at least 2 characters";
      break;

    case "companyEmail":
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email format";
      break;

    case "password":
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
        return "Password must include uppercase, lowercase & number";
      break;

    case "confirmPassword":
      if (value !== formData.password) return "Passwords do not match";
      break;
  }

  return "";
}

export function validateStep(
  step: number,
  formData: CompanyRegistrationFormData,
): FormErrors {
  const fields =
    step === 1
      ? ["companyName", "companyEmail", "companySize", "industry"]
      : [
          "firstName",
          "lastName",
          "email",
          "phoneNumber",
          "password",
          "confirmPassword",
        ];

  const errors: FormErrors = {};

  fields.forEach((field) => {
    const error = validateField(
      field as any,
      formData[field as keyof CompanyRegistrationFormData],
      formData,
    );
    if (error) errors[field] = error;
  });

  return errors;
}
