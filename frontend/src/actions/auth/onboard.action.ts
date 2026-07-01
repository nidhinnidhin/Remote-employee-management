"use server";

import { getSession } from "@/lib/iron-session/getSession";
import { serverActionApi as api } from "@/lib/axios/axiosServer";
import { AuthActionResult } from "@/shared/types/company/auth/company-login/login-response.type";
import { setRefreshTokenCookie, setAccessTokenCookie } from "@/lib/auth/cookies";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";
import { API_ROUTES } from "@/constants/api.routes";

export interface OnboardPayload {
  userId: string;
  companyName?: string;
  industry?: string;
  companySize?: string;
  [key: string]: unknown;
}

export async function onboardAction(payload: OnboardPayload): Promise<AuthActionResult> {
    try {
        const session = await getSession();

        if (!payload.userId) {
            return { success: false, error: "User identification missing. Please sign up again." };
        }

        const response = await api.post(API_ROUTES.AUTH.ONBOARD, payload);

        const { accessToken, refreshToken, user } = response.data;

        // Set backend cookies
        if (accessToken) await setAccessTokenCookie(accessToken);
        if (refreshToken) await setRefreshTokenCookie(refreshToken);

        // Update session with tokens and onboarding status
        session.accessToken = accessToken;
        session.refreshToken = refreshToken;
        session.userId = user.id;
        session.role = user.role;
        session.email = user.email;
        session.isOnboarded = false;
        session.companyId = response.data.company?.id;
        await session.save();

        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        console.error("[onboardAction] Error:", error);
        return {
            success: false,
            error: err.response?.data?.message || err.message || "Onboarding failed",
        };
    }
}

export async function getOnboardingStatusAction(userId: string): Promise<AuthActionResult> {
    try {
        const response = await api.post(API_ROUTES.AUTH.ONBOARDING_STATUS, { userId });
        return {
            success: true,
            data: response.data,
        };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        return {
            success: false,
            error: err.response?.data?.message || "Failed to fetch status",
        };
    }
}
export async function finalizeOnboardingAction(userId: string): Promise<AuthActionResult> {
    try {
        const session = await getSession();
        const response = await api.post('/auth/onboarding/finalize', { userId });
        
        if (response.data.success) {
            session.isOnboarded = true;
            await session.save();
            return { success: true, data: response.data };
        }
        return { success: false, error: "Failed to finalize onboarding" };
    } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        return { success: false, error: err.response?.data?.message || "Finalization failed" };
    }
}
