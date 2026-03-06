"use server";

import { resetPasswordService } from "@/services/company/forgot-password/reset-password.service";

export const resetPasswordAction = async (
  email: string,
  newPassword: string
) => {
  try {
    const response = await resetPasswordService({
      email,
      newPassword,
    });

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
        "Password reset failed",
    };
  }
};
