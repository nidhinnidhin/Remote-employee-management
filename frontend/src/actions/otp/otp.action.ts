"use server";

import { serverActionApi } from "@/lib/axios/axiosServer";
import { getSession } from "@/lib/iron-session/getSession";
import { setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth/cookies";
import { OTP_MESSAGES } from "@/shared/constants/messages/otp.messages";
import { API_ROUTES } from "@/constants/api.routes";

export async function verifyOtpAction(payload: { email: string; otp: string }) {
  try {
    // ✅ Use serverActionApi (API_URL_INTERNAL) so this works inside Docker:
    //    NEXT_PUBLIC_API_URL = http://localhost:4000/api (baked at build time)
    //    is unreachable from inside the Next.js server container, which cannot
    //    talk to itself on port 4000. serverActionApi uses API_URL_INTERNAL
    //    = http://backend:4000/api (Docker internal DNS) at runtime, which works.
    const response = await serverActionApi.post(API_ROUTES.AUTH.OTP.VERIFY, payload);

    // The backend verify endpoint returns a flat object { user, accessToken, refreshToken }
    // (NOT wrapped in { success, data, message }), so we read it directly.
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
      session.email = user.email;
      session.accessToken = accessToken;
      session.refreshToken = refreshToken;
      session.isOnboarded = user.isOnboarded;
      await session.save();
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message =
      err.response?.data?.message ||
      err.message ||
      OTP_MESSAGES.OTP_NOT_VERIFIED;

    console.error("[verifyOtpAction] OTP verification failed:", message);

    return {
      success: false,
      error: message,
    };
  }
}
