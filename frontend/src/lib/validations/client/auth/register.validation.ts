import {
  StepOneErrors,
  StepOneFormData,
} from "@/shared/types/company/auth/company-registeration/step-one-formdata.type";
import {
  StepTwoErrors,
  StepTwoFormData,
} from "@/shared/types/company/auth/company-registeration/step-two-formdata.type";

export const validateStepOne = (formData: StepOneFormData): StepOneErrors => {
  const errors: StepOneErrors = {};

  // Company Name
  const companyName = formData.companyName.trim();
  if (!companyName) {
    errors.companyName = "Company name is required";
  } else if (companyName.length < 2 || companyName.length > 100) {
    errors.companyName = "Company name must be between 2 and 100 characters";
  } else if (!/^[a-zA-Z0-9\s&.,-]+$/.test(companyName)) {
    errors.companyName = "Company name contains invalid characters";
  }

  // Company Email
  if (!formData.companyEmail.trim()) {
    errors.companyEmail = "Company email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)
  ) {
    errors.companyEmail = "Invalid email format";
  }

  // Employee Size
  if (!formData.employeeSize) {
    errors.employeeSize = "Employee size is required";
  }

  // Industry
  if (!formData.industry) {
    errors.industry = "Industry is required";
  }

  // Website URL (optional)
  if (formData.websiteUrl.trim()) {
    try {
      const url = new URL(formData.websiteUrl);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.websiteUrl = "Website must start with http:// or https://";
      }
    } catch {
      errors.websiteUrl = "Invalid website URL";
    }
  }

  return errors;
};


export const validateStepTwo = (formData: StepTwoFormData): StepTwoErrors => {
  const errors: StepTwoErrors = {};

  // First Name
  const firstName = formData.firstName.trim();
  if (!firstName) {
    errors.firstName = "First name is required";
  } else if (!/^[a-zA-Z\s-]{2,50}$/.test(firstName)) {
    errors.firstName = "First name contains invalid characters";
  }

  // Last Name
  const lastName = formData.lastName.trim();
  if (!lastName) {
    errors.lastName = "Last name is required";
  } else if (!/^[a-zA-Z\s-]{2,50}$/.test(lastName)) {
    errors.lastName = "Last name contains invalid characters";
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format";
  }

  // Phone (10 digits only)
  const normalizedPhone = formData.phone.replace(/\D/g, "");
  if (!normalizedPhone) {
    errors.phone = "Phone number is required";
  } else if (normalizedPhone.length !== 10) {
    errors.phone = "Phone number must be exactly 10 digits";
  }

  // Password
  const password = formData.password;
  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8 || password.length > 64) {
    errors.password = "Password must be between 8 and 64 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.password = "Password must contain at least one special character";
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (formData.confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};
