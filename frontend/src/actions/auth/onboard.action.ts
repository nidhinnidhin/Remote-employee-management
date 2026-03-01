"use server";

import { getSession } from "@/lib/iron-session/getSession";
import { clientApi as api } from "@/lib/axios/axiosClient";
import { AuthActionResult } from "@/shared/types/company/auth/company-login/login-response.type";
import { setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth/cookies";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

export async function onboardAction(payload: any): Promise<AuthActionResult> {
    try {
        const session = await getSession();

        if (!payload.userId) {
            return { success: false, error: "User identification missing. Please sign up again." };
        }

        const response = await api.post("/auth/onboard", payload);

        const { accessToken, refreshToken, user } = response.data;

        // Set backend cookies
        if (accessToken) await setAccessTokenCookie(accessToken);
        if (refreshToken) await setRefreshTokenCookie(refreshToken);

        // Update session with tokens and onboarding status
        session.accessToken = accessToken;
        session.userId = user.id;
        session.role = user.role;
        session.email = user.email;
        session.isOnboarded = true;
        session.companyId = response.data.company?.id;
        await session.save();

        return {
            success: true,
            data: response.data,
        };
    } catch (error: any) {
        console.error("[onboardAction] Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Onboarding failed",
        };
    }
}
