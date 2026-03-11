"use server";

import { verifyOtp } from "@/services/company/otp/verify-otp.service";
import { getSession } from "@/lib/iron-session/getSession";
import { setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth/cookies";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

export async function verifyOtpAction(payload: { email: string; otp: string }) {
  try {
    const response = await verifyOtp(payload);

    const { user, accessToken, refreshToken } = response.data;
    if (!user || !user.id) {
      throw new Error("Invalid response from server: user data missing");
    }

    if (accessToken && refreshToken) {
      await setAccessTokenCookie(accessToken);
      await setRefreshTokenCookie(refreshToken);

      const session = await getSession();
      session.userId = user.id;
      session.role = user.role;
      session.accessToken = accessToken;
      session.isOnboarded = user.isOnboarded;
      await session.save();
    }

    return {
      success: true,
      data: response.data,
    };
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
