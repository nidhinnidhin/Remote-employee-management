"use server";

import { verifyResetPasswordOtpService } from "@/services/company/forgot-password/verify-reset-password.service";

export const verifyResetPasswordOtpAction = async (
  email: string,
  otp: string,
) => {
  try {
    const response = await verifyResetPasswordOtpService({ email, otp });
    console.log(response)

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error:
        err?.response?.data?.message ||
        err.message ||
        "OTP verification failed",
    };
  }
};
