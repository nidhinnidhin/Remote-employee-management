"use server";

import { registerSchema } from "@/lib/validations/schemas/auth.schema";
import { registerUser } from "@/services/company/auth/register.service";
import { AUTH_MESSAGES } from "@/shared/constants/auth.messages";

export async function registerAction(formData: any) {
  const payload = {
    company: {
      name: formData.companyName,
      email: formData.companyEmail,
      size: formData.employeeSize,
      industry: formData.industry,
      website: formData.websiteUrl || null,
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
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const data = await registerUser(parsed.data);
    return { success: true, data };
  } catch (e: any) {
    return {
      error: e.response?.data?.message || AUTH_MESSAGES.REGISTRATION_FAILED,
    };
  }
}
