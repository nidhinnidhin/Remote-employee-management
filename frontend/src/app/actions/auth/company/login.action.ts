"use server";

import { api } from "@/lib/axiosInstance";
import { getSession } from "@/lib/iron-session/getSession";
import { setRefreshTokenCookie } from "@/lib/auth/cookies";
import { AUTH_MESSAGES } from "@/shared/constants/auth.messages";
import { loginUser } from "@/services/company/auth/login.service";
import { LoginPayload } from "@/types/auth/company-login/login-payload.type";
import {
  AuthActionResult,
  LoginResponse,
} from "@/types/auth/company-login/login-response.type";

export async function loginAction(
  payload: LoginPayload,
): Promise<AuthActionResult<LoginResponse>> {
  try {
    const response = await loginUser(payload);

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
  } catch (e: any) {
    return {
      success: false,
      error: e.response?.data?.message || "Login failed",
    };
  }
}
