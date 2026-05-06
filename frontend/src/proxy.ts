import { getSession } from "@/lib/iron-session/getSession";
import { NextRequest, NextResponse } from "next/server";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { API_ROUTES } from "@/constants/api.routes";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Attempt to silently refresh the access token using the refresh_token cookie
 * OR the refresh token stored in the iron-session (whichever is available).
 * Returns the new access token string, or null if the refresh failed.
 */
async function tryRefreshToken(req: NextRequest, sessionRefreshToken?: string): Promise<string | null> {
    // Prefer the raw httpOnly cookie from the browser (set by the backend directly)
    const refreshTokenCookie = req.cookies.get("refresh_token")?.value ?? sessionRefreshToken;
    if (!refreshTokenCookie) return null;

    try {
        const refreshResponse = await fetch(
            `${BACKEND_URL}${API_ROUTES.AUTH.REFRESH}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: `refresh_token=${refreshTokenCookie}`,
                },
            }
        );

        if (!refreshResponse.ok) return null;

        const body = await refreshResponse.json();
        // The backend returns { success: true, data: { accessToken } }
        const newAccessToken = body?.data?.accessToken ?? body?.accessToken;
        return newAccessToken ?? null;
    } catch {
        return null;
    }
}

export async function proxy(req: NextRequest) {
    const session = await getSession();
    const { pathname } = req.nextUrl;

    console.log("PROXY:", {
        pathname,
        hasToken: !!session.accessToken,
        role: session.role,
        isOnboarded: session.isOnboarded,
        isAuthenticated: !!session.accessToken && !!session.role,
    });

    const isAuthenticated = !!session.accessToken && !!session.role;
    const isOnboarded = session.isOnboarded === true;

    // Public auth routes (no login required)
    const isAuthRoute =
        pathname.startsWith(FRONTEND_ROUTES.AUTH.LOGIN) ||
        pathname.startsWith(FRONTEND_ROUTES.AUTH.REGISTER);

    // Onboarding route is special - it's an "auth route" but also a "protected route" for non-onboarded users
    const isOnboardingRoute = pathname.startsWith(FRONTEND_ROUTES.AUTH.ONBOARDING);

    // Employee invite/onboarding routes — always public, no session needed
    const isEmployeeAuthRoute = pathname.startsWith(FRONTEND_ROUTES.ADMIN.INVITE.BASE);

    // Protected routes — require authentication
    const EMPLOYEE_ROOT_ROUTES = [
        "/chats", "/discussions", "/announcements", "/attendance",
        "/leaves", "/directory", "/mood", "/performance", "/reports",
        "/settings", "/calendar",
    ];
    const isProtectedRoute =
        !isEmployeeAuthRoute &&
        (pathname.startsWith("/employee") ||
            pathname.startsWith("/super-admin") ||
            pathname.startsWith("/admin") ||
            pathname.startsWith(FRONTEND_ROUTES.AUTH.DASHBOARD) ||
            pathname.startsWith(FRONTEND_ROUTES.EMPLOYEE.DASHBOARD) ||
            EMPLOYEE_ROOT_ROUTES.some((r) => pathname.startsWith(r)));

    // 1. Handle Unauthenticated Users
    if (!isAuthenticated) {
        if (isProtectedRoute || isOnboardingRoute) {
            return NextResponse.redirect(new URL(FRONTEND_ROUTES.AUTH.LOGIN, req.url));
        }
        return NextResponse.next();
    }

    // 2. Handle Authenticated but NOT Onboarded Users (Company Admins only)
    if (isAuthenticated && !isOnboarded && session.role === "COMPANY_ADMIN") {
        // If they are NOT on the onboarding page, redirect them there
        if (!isOnboardingRoute && isProtectedRoute) {
            return NextResponse.redirect(new URL(FRONTEND_ROUTES.AUTH.ONBOARDING, req.url));
        }
        // If they ARE on the onboarding page, let them proceed
        if (isOnboardingRoute) {
            return NextResponse.next();
        }
    }

    // 3. Handle Authenticated and Onboarded Users (or other roles)
    if (isAuthenticated) {
        // If they are on an auth route (login/register) or onboarding (if already onboarded), redirect to dashboard
        if (isAuthRoute || (isOnboardingRoute && isOnboarded)) {

            if (req.nextUrl.searchParams.get("error") === "suspended") {
                const resp = NextResponse.next();
                resp.cookies.delete("app_session");
                return resp;
            }

            const dashboardUrl = getRedirectForRole(session.role!);
            return NextResponse.redirect(new URL(dashboardUrl, req.url));
        }
    }

    // 4. Verify session with backend for protected routes
    if (isAuthenticated && isProtectedRoute) {
        try {
            const response = await fetch(`${BACKEND_URL}${API_ROUTES.AUTH.PROFILE.ME}`, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            });

            if (response.status === 401) {
                // --- ACCESS TOKEN EXPIRED: TRY TO REFRESH ---
                console.log("PROXY: Access token expired, attempting refresh...");
                const newAccessToken = await tryRefreshToken(req, session.refreshToken);

                if (newAccessToken) {
                    // Refresh succeeded — update the session with the new token
                    console.log("PROXY: Refresh successful, continuing request.");
                    session.accessToken = newAccessToken;
                    await session.save();
                    // Let the request proceed; client-side axios will use the new cookie on next call
                    return NextResponse.next();
                }

                // Refresh also failed — the user must log in again
                console.log("PROXY: Refresh failed, redirecting to login.");
                const loginPath = pathname.startsWith("/super-admin")
                    ? FRONTEND_ROUTES.SUPER_ADMIN.LOGIN
                    : FRONTEND_ROUTES.AUTH.LOGIN;
                const redirResponse = NextResponse.redirect(new URL(loginPath, req.url));
                redirResponse.cookies.delete("app_session");
                return redirResponse;
            }

            if (response.status === 403) {
                const data = await response.json().catch(() => ({}));
                const isBlocked = data.message?.includes("blocked") || data.message?.includes("Blocked");
                const errorType = isBlocked ? "blocked" : "suspended";
                const redirResponse = NextResponse.redirect(new URL(`${FRONTEND_ROUTES.AUTH.LOGIN}?error=${errorType}`, req.url));
                redirResponse.cookies.delete("app_session");
                return redirResponse;
            }
        } catch (error) {
            console.error("Proxy Auth Check Error:", error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
