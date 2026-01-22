"use server";

import { api } from "@/lib/axiosInstance";
import { registerSchema } from "@/lib/validations/schemas/auth.schema";

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

  // Optional Zod validation
  const parsed = registerSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await api.post("/auth/register", parsed.data);

    // Backend should send OTP here
    console.log("Register API success:", response.data);

    return {
      success: true,
      data: response.data,
    };
  } catch (e: any) {
    console.error("Register API failed:", e.response?.data || e.message);
    return {
      error: e.response?.data?.message || "Registration failed",
    };
  }
}
