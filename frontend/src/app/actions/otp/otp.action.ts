"use server";

import { api } from "@/lib/axiosInstance";
import { getSession } from "@/lib/iron-session/getSession";

export async function verifyOtpAction(payload: {
  email: string;
  otp: string;
}) {
  try {
    console.log("verifyOtpAction: Calling backend /auth/verify-otp with:", payload);

    const response = await api.post("/auth/verify-otp", payload);

    console.log("verifyOtpAction: Backend raw response data:", response.data);

    const { accessToken } = response.data;

    if (!accessToken) {
      return {
        error: "No access token returned from backend",
      };
    }

    // Save access token into Iron Session (Server-side)
    const session = await getSession();
    session.accessToken = accessToken;
    await session.save();
    
    console.log("SESSION CONTENT:", session);
    console.log("verifyOtpAction: Access token saved into iron-session");

    return {
      success: true,
      data: response.data,
    };

  } catch (e: any) {
    return {
      error: e.response?.data?.message || "OTP verification failed",
    };
  }
}
