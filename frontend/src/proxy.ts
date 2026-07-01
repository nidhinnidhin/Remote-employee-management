import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session/session";
import { NextRequest, NextResponse } from "next/server";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { API_ROUTES } from "@/constants/api.routes";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

const BACKEND_URL = process.env.API_URL_INTERNAL || "http://backend:4000/api";
console.log('---------------------------env', BACKEND_URL)
console.log('PROXY ENV DEBUG:', {
    LOCAL_DEV: process.env.LOCAL_DEV,
    NODE_ENV: process.env.NODE_ENV,
    HAS_SESSION_SECRET: !!process.env.SESSION_SECRET,
    SESSION_SECRET_LENGTH: process.env.SESSION_SECRET ? process.env.SESSION_SECRET.length : 0
});

/**
 * Attempt to silently refresh the access token using the refresh_token cookie
 * OR the refresh token stored in the iron-session (whichever is available).
 * Returns the new access token string, or null if the refresh failed.
 */
async function tryRefreshToken(
    req: NextRequest,
    sessionRefreshToken?: string
): Promise<string | null> {
    // Prefer the raw httpOnly cookie from the browser (set by the backend directly)
    const refreshTokenCookie =
        req.cookies.get("refresh_token")?.value ?? sessionRefreshToken;

    if (!refreshTokenCookie) {
        console.log("PROXY: No refresh token available (cookie or session).");
        return null;
    }

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

        if (!refreshResponse.ok) {
            console.log(
                "PROXY: Backend refresh returned non-ok status:",
                refreshResponse.status
            );
            return null;
        }

        const body = await refreshResponse.json();
        // The backend returns { success: true, data: { accessToken } } OR { accessToken }
        const newAccessToken = body?.data?.accessToken ?? body?.accessToken;
        return newAccessToken ?? null;
    } catch (err) {
        console.error("PROXY: tryRefreshToken fetch error:", err);
        return null;
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ── Read session from the incoming request ────────────────────────────────
    // iron-session v8 (3-arg form): reads from req, writes to res.
    // We build a temporary response just to read the session.
    const readRes = new NextResponse();
    const session = await getIronSession<SessionData>(req, readRes, sessionOptions);

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
                    console.log("PROXY: Refresh successful, updating session and continuing.");

                    // ✅ KEY FIX: use the 3-arg getIronSession(req, nextRes, options) form.
                    //
                    // In Next.js middleware we CANNOT write to the session by calling
                    // session.save() on the session that was built from req.cookies — the
                    // middleware response headers for Set-Cookie are silently dropped for the
                    // encrypted `app_session` cookie.
                    //
                    // The correct pattern is:
                    //   1. Create a NextResponse.next() that will be returned.
                    //   2. Build a *new* iron-session against (req, thatResponse, options).
                    //   3. Populate the session fields and call save() on it.
                    //   4. iron-session appends Set-Cookie to thatResponse's headers.
                    //   5. The browser receives the updated app_session cookie and all
                    //      subsequent requests carry the new (valid) access token.
                    const nextRes = NextResponse.next();
                    const outSession = await getIronSession<SessionData>(req, nextRes, sessionOptions);

                    outSession.accessToken = newAccessToken;
                    outSession.refreshToken = session.refreshToken;
                    outSession.userId = session.userId;
                    outSession.role = session.role;
                    outSession.email = session.email;
                    outSession.companyId = session.companyId;
                    outSession.isOnboarded = session.isOnboarded;
                    await outSession.save();

                    return nextRes;
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
