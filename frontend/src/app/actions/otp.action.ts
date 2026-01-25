"use server";

import { api } from "@/lib/axiosInstance";

export async function verifyOtpAction(payload: {
  email: string;
  otp: string;
}) {
  try {
    const response = await api.post("/auth/verify-otp", payload);
    return { success: true, data: response.data };
    
  } catch (e: any) {
    return {
      error: e.response?.data?.message || "OTP verification failed",
    };
  }
}
