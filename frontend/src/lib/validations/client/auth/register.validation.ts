import {
  StepOneErrors,
  StepOneFormData,
} from "@/types/company/auth/company-registeration/step-one-formdata.type";
import {
  StepTwoErrors,
  StepTwoFormData,
} from "@/types/company/auth/company-registeration/step-two-formdata.type";

export const validateStepOne = (formData: StepOneFormData): StepOneErrors => {
  const errors: StepOneErrors = {};

  if (!formData.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!formData.companyEmail.trim()) {
    errors.companyEmail = "Company email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
    errors.companyEmail = "Invalid email format";
  }

  if (!formData.employeeSize) {
    errors.employeeSize = "Employee size is required";
  }

  if (!formData.industry) {
    errors.industry = "Industry is required";
  }

  if (formData.websiteUrl.trim() !== "") {
    const urlRegex = /^https?:\/\/.+\..+/;
    if (!urlRegex.test(formData.websiteUrl)) {
      errors.websiteUrl = "Website must start with http:// or https://";
    }
  }

  return errors;
};

export const validateStepTwo = (formData: StepTwoFormData): StepTwoErrors => {
  const errors: StepTwoErrors = {};

  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone is required";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};
