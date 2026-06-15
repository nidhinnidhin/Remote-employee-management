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
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error:
        err?.response?.data?.message ||
        err.message ||
        "Password reset failed",
    };
  }
};
