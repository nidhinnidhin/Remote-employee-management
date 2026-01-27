"use server";

import { api } from "@/lib/axiosInstance";
import { getSession } from "@/lib/iron-session/getSession";
import { cookies } from "next/headers";

export async function verifyOtpAction(payload: {
  email: string;
  otp: string;
}) {
  console.log("verifyOtpAction: Triggered with payload:", payload);
  try {
    const response = await api.post("/auth/verify-otp", payload);
    console.log("verifyOtpAction: Backend response status:", response.status);

    // FORWARD COOKIES FROM BACKEND TO BROWSER
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      console.log("verifyOtpAction: Found set-cookie header from backend, forwarding...");
      const cookieStore = await cookies();

      for (const cookieStr of setCookieHeader) {
        // Simple parser for set-cookie string
        const parts = cookieStr.split(';');
        const [nameValue] = parts;
        const [name, value] = nameValue.split('=');

        if (name.trim() === 'refresh_token') {
          console.log("verifyOtpAction: Forwarding refresh_token cookie");
          (await cookies()).set('refresh_token', value, {
            httpOnly: true,
            secure: false, // port 4000 is likely http in dev
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60
          });
        }
      }
    } else {
      console.warn("verifyOtpAction: No set-cookie header found in backend response");
    }

    const { accessToken } = response.data;

    if (!accessToken) {
      console.error("verifyOtpAction: No access token found in response data");
      throw new Error("No access token returned from backend");
    }

    const session = await getSession();
    session.accessToken = accessToken;
    // session.refreshToken = refreshToken; // REMOVED AS REQUESTED
    await session.save();
    console.log("verifyOtpAction: Iron-session saved with accessToken only");

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("verifyOtpAction: ERROR:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "OTP verification failed",
    };
  }
}
