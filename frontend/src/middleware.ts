import { getSession } from "@/lib/iron-session/getSession";
import { NextRequest, NextResponse } from "next/server";
import { getRedirectForRole } from "@/lib/auth/auth-constants";
import { API_ROUTES } from "@/constants/api.routes";
import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

export async function middleware(req: NextRequest) {
  const session = await getSession();
  const { pathname } = req.nextUrl;

  console.log("MIDDLEWARE:", {
    pathname,
    hasToken: !!session.accessToken,
    role: session.role,
    isAuthenticated: !!session.accessToken && !!session.role,
  });

  const isAuthenticated = !!session.accessToken && !!session.role;

  // Public auth routes (no login required)
  const isAuthRoute =
    pathname.startsWith(FRONTEND_ROUTES.AUTH.LOGIN) ||
    pathname.startsWith(FRONTEND_ROUTES.AUTH.REGISTER) ||
    pathname.startsWith(FRONTEND_ROUTES.AUTH.ONBOARDING);

  // Employee invite/onboarding routes — always public, no session needed
  const isEmployeeAuthRoute = pathname.startsWith(FRONTEND_ROUTES.ADMIN.INVITE.BASE);

  // Protected routes — require authentication
  const isProtectedRoute =
    !isEmployeeAuthRoute &&
    (pathname.startsWith("/employee") ||
      pathname.startsWith("/super-admin") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith(FRONTEND_ROUTES.AUTH.DASHBOARD) ||
      pathname.startsWith(FRONTEND_ROUTES.EMPLOYEE.DASHBOARD));

  // Redirect authenticated users away from auth routes (login/register)
  if (isAuthenticated && isAuthRoute) {
    // If the user is being redirected to the login page because of a suspension,
    // we must clear their session instead of redirecting them back to the dashboard.
    // This breaks the redirect loop.
    if (req.nextUrl.searchParams.get("error") === "suspended") {
      const resp = NextResponse.next();
      resp.cookies.delete("app_session");
      return resp;
    }

    const dashboardUrl = getRedirectForRole(session.role!);
    const targetUrl = new URL(dashboardUrl, req.url);

    // Only redirect if the target is different from current page to avoid loops
    if (targetUrl.pathname !== pathname) {
      return NextResponse.redirect(targetUrl);
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL(FRONTEND_ROUTES.AUTH.LOGIN, req.url));
  }

  // If authenticated and on a protected route, verify company status with backend
  if (isAuthenticated && isProtectedRoute) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${API_ROUTES.AUTH.PROFILE.ME}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid - clear session and redirect
        const loginPath = pathname.startsWith("/super-admin") ? FRONTEND_ROUTES.SUPER_ADMIN.LOGIN : FRONTEND_ROUTES.AUTH.LOGIN;
        const redirResponse = NextResponse.redirect(new URL(loginPath, req.url));
        redirResponse.cookies.delete("app_session");
        return redirResponse;
      }

      if (response.status === 403) {
        // Distinguish between company suspension and user block
        const data = await response.json().catch(() => ({}));
        const isBlocked = data.message?.includes("blocked") || data.message?.includes("Blocked");
        const errorType = isBlocked ? "blocked" : "suspended";

        // Company/User suspended - clear session and redirect
        // We use an explicit cookie delete in the redirect response to ensure it sticks
        const redirResponse = NextResponse.redirect(new URL(`${FRONTEND_ROUTES.AUTH.LOGIN}?error=${errorType}`, req.url));
        redirResponse.cookies.delete("app_session");
        return redirResponse;
      }
    } catch (error) {
      console.error("Middleware Auth Check Error:", error);
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
