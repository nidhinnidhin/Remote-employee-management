"use server";

import { verifyOtp } from "@/services/company/otp/verify-otp.service";
import { getSession } from "@/lib/iron-session/getSession";
import { setRefreshTokenCookie } from "@/lib/auth/cookies";
import { OTP_MESSAGES } from "@/shared/constants/otp.messages";
import { AUTH_MESSAGES } from "@/shared/constants/auth.messages";

export async function verifyOtpAction(payload: { email: string; otp: string }) {
  try {
    const response = await verifyOtp(payload);

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      for (const cookieStr of setCookieHeader) {
        const [nameValue] = cookieStr.split(";");
        const [name, value] = nameValue.split("=");

        if (name.trim() === "refresh_token") {
          await setRefreshTokenCookie(value);
        }
      }
    }

    const { accessToken } = response.data;
    if (!accessToken) throw new Error(AUTH_MESSAGES.NO_ACCESS_TOKEN_RETURNED);

    const session = await getSession();
    session.accessToken = accessToken;
    await session.save();

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        OTP_MESSAGES.OTP_NOT_VERIFIED,
    };
  }
}
