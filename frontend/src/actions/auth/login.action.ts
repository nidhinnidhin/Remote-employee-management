"use server";

import { getSession } from "@/lib/iron-session/getSession";
import {
  setRefreshTokenCookie,
  setAccessTokenCookie,
} from "@/lib/auth/cookies";
import { clientApi } from "@/lib/axios/axiosClient";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { redirect } from "next/navigation";
import { LoginResponse } from "@/shared/types/company/auth/company-login/login-response.type";

export async function loginAction(email: string, password: string) {
  try {
    const response = await clientApi.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = response.data;

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
    session.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId,
    };
    session.isLoggedIn = true;

    await session.save();

    console.log("-----------------------------------------");
    console.log(" NEW LOGIN SUCCESSFUL");
    console.log(" Email:", user.email);
    console.log(" Role:", user.role);
    console.log("-----------------------------------------");

    // Redirect based on role
    const redirectUrl = getRedirectForRole(user.role);
    redirect(redirectUrl);
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
