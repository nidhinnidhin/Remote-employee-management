"use server";

import { forgotPasswordService } from "@/services/company/forgot-password/forgot-password.service";

export const forgotPasswordAction = async (email: string) => {
  try {
    const response = await forgotPasswordService({ email });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.response?.data?.message || error.message || "Failed to send OTP",
    };
  }
};
