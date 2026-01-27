"use server";

import { api } from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export async function verifyOtpAction(payload: {
  email: string;
  otp: string;
}) {
  try {
    console.log("verifyOtpAction: Calling backend /auth/verify-otp with:", payload);
    const response = await api.post("/auth/verify-otp", payload);
    console.log("verifyOtpAction: Backend raw response data:", response.data);

    const { accessToken } = response.data;
    console.log("verifyOtpAction: Extracted accessToken:", accessToken ? "FOUND" : "MISSING");

    if (accessToken) {
      (await cookies()).set("access_token", accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      console.log("verifyOtpAction: Cookie 'access_token' set successfully");
    }

    return { success: true, data: response.data };

  } catch (e: any) {
    return {
      error: e.response?.data?.message || "OTP verification failed",
    };
  }
}
