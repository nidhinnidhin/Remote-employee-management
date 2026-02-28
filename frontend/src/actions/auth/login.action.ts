"use server";

import { getSession } from "@/lib/iron-session/getSession";
import {
  setRefreshTokenCookie,
  setAccessTokenCookie,
} from "@/lib/auth/cookies";
import { clientApi as api } from "@/lib/axios/axiosClient";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { redirect } from "next/navigation";
import {
  LoginResponse,
  AuthActionResult
} from "@/shared/types/company/auth/company-login/login-response.type";

export async function loginAction(email: string, password: string): Promise<AuthActionResult<LoginResponse>> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    // IF NOT ONBOARDED: Do NOT establish session or cookies
    if (!user.isOnboarded) {
      console.log("-----------------------------------------");
      console.log(" LOGIN: ONBOARDING REQUIRED");
      console.log(" User:", user.email);
      console.log("-----------------------------------------");

      return {
        success: true,
        data: response.data,
      };
    }

    // Handle cookies from response headers
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      for (const cookieStr of setCookieHeader) {
        const [nameValue] = cookieStr.split(";");
        const [name, value] = nameValue.split("=");
        const trimmedName = name.trim();

        if (trimmedName === "refresh_token") {
          await setRefreshTokenCookie(value);
        } else if (trimmedName === "access_token") {
          await setAccessTokenCookie(value);
        }
      }
    }

    // Save to session with role and user info
    const session = await getSession();
    session.accessToken = accessToken;
    session.userId = user.id;
    session.role = user.role;
    session.email = user.email;
    session.isOnboarded = user.isOnboarded;
    await session.save();

    console.log("-----------------------------------------");
    console.log(" UNIFIED LOGIN SUCCESSFUL");
    console.log(" Email:", user.email);
    console.log(" Role:", user.role);
    console.log(" IsOnboarded:", user.isOnboarded);
    console.log("-----------------------------------------");

    const redirectUrl = getRedirectForRole(user.role);
    redirect(redirectUrl);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("[loginAction] Error:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.",
    };
  }
}
