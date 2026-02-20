"use server";

import { registerSchema } from "@/lib/validations/schemas/auth.schema";
import { registerUser } from "@/services/company/auth/register.service";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { RegisterFormData } from "@/shared/types/company/auth/company-registeration/company-registration.type";
import { RegisterCompanyPayload } from "@/shared/types/company/auth/company-registeration/register-company-payload.type";

export async function registerAction(formData: RegisterFormData) {
  const payload: RegisterCompanyPayload = {
    company: {
      name: formData.companyName,
      email: formData.companyEmail,
      size: formData.employeeSize,
      industry: formData.industry,
      website: formData.websiteUrl || undefined,
    },
    admin: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    },
  };

  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Validation failed";
    return { success: false, error: errorMsg };
  }

  try {
    const data = await registerUser(parsed.data);
    return { success: true, data };
  } catch (e: any) {
    return {
      success: false,
      error: e.response?.data?.message || e.message || AUTH_MESSAGES.REGISTRATION_FAILED,
    };
  }
}
