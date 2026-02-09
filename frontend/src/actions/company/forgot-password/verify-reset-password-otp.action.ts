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
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error.message ||
        "OTP verification failed",
    };
  }
};
