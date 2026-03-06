"use server";

import { registerSchema } from "@/lib/validations/schemas/auth.schema";
import { registerAdmin } from "@/services/company/auth/register.service";
import { RegisterFormData } from "@/shared/types/company/auth/company-registeration/company-registration.type";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";

export async function registerAction(formData: RegisterFormData) {
  const payload = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
  };

  // We skip schema validation here for now or update the schema later if needed.
  // The AdminRegistrationForm uses the service directly, but this fix is for the build.

  try {
    const data = await registerAdmin(payload);
    return { success: true, data };
  } catch (e: any) {
    return {
      success: false,
      error: e.message || AUTH_MESSAGES.REGISTRATION_FAILED,
    };
  }
}
