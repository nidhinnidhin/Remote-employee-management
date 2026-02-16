import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { AdminLoginErrors, AdminLoginFormData } from "@/shared/types/superadmin/auth/login-form-data.type";

export function validateAdminLogin(
  formData: AdminLoginFormData
): AdminLoginErrors {
  const errors: AdminLoginErrors = {};

  if (!formData.email) {
    errors.email = AUTH_MESSAGES.EMAIL_MISSING;
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = AUTH_MESSAGES.INVALID_EMAIL;
  }

  if (!formData.password) {
    errors.password = AUTH_MESSAGES.PASSWORD_REQUIRED;
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
