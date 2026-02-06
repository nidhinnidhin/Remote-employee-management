"use server";

import { superAdminLogin } from "@/services/super-admin/auth/login.service";
import { getSession } from "@/lib/iron-session/getSession";
import { setRefreshTokenCookie } from "@/lib/auth/cookies";
import { AUTH_MESSAGES } from "@/shared/constants/messages/auth.messages";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

export async function superAdminLoginAction(payload: {
  email: string;
  password: string;
}) {
  try {
    const response = await superAdminLogin(payload);

    // Handle refresh token from set-cookie header
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader) {
      for (const cookieStr of setCookieHeader) {
        const [nameValue] = cookieStr.split(";");
        const [name, value] = nameValue.split("=");

        if (name.trim() === COOKIE_KEYS.REFRESH_TOKEN) {
          await setRefreshTokenCookie(value);
        }
      }
    }

    // Handle access token
    const { accessToken } = response.data;

    if (!accessToken) {
      throw new Error(AUTH_MESSAGES.NO_ACCESS_TOKEN_RETURNED);
    }

    const session = await getSession();
    session.accessToken = accessToken;
    await session.save();

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
        AUTH_MESSAGES.LOGIN_FAILED,
    };
  }
}
