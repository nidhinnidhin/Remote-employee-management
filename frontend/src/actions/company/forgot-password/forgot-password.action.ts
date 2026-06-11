"use server";

import { forgotPasswordService } from "@/services/company/forgot-password/forgot-password.service";

export const forgotPasswordAction = async (email: string) => {
  try {
    const response = await forgotPasswordService({ email });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error:
        err?.response?.data?.message || err.message || "Failed to send OTP",
    };
  }
};
