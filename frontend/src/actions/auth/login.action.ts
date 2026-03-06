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
import { API_ROUTES } from "@/constants/api.routes";

export async function loginAction(email: string, password: string): Promise<AuthActionResult<LoginResponse>> {
  try {
    const response = await api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

    // IF NOT ONBOARDED: Only COMPANY_ADMIN needs onboarding before session creation
    if (user.role === "COMPANY_ADMIN" && !user.isOnboarded) {
      console.log("-----------------------------------------");
      console.log(" LOGIN: ONBOARDING REQUIRED (COMPANY_ADMIN)");
      console.log(" User:", user.email);
      console.log("-----------------------------------------");

      return {
        success: true,
        data: response.data,
      };
    }

    // Set backend cookies
    if (accessToken) await setAccessTokenCookie(accessToken);
    if (refreshToken) await setRefreshTokenCookie(refreshToken);

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

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
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
