import { getSession } from "@/lib/iron-session/getSession";
import { NextRequest, NextResponse } from "next/server";
import { getRedirectForRole } from "@/lib/auth/auth-constants";

export async function middleware(req: NextRequest) {
  const session = await getSession();
  const { pathname } = req.nextUrl;

  const isAuthenticated = !!session.accessToken && !!session.role;

  // Define route groups
  const isAuthRoute = pathname.startsWith("/company/login") || pathname.startsWith("/company/register");
  const isProtectedRoute =
    pathname.startsWith("/employees") ||
    pathname.startsWith("/super-admin") ||
    pathname.startsWith("/company/employees");

  // Redirect authenticated users away from auth routes (login/register)
  if (isAuthenticated && isAuthRoute) {
    const dashboardUrl = getRedirectForRole(session.role!);
    const targetUrl = new URL(dashboardUrl, req.url);

    // Only redirect if the target is different from current page to avoid loops
    if (targetUrl.pathname !== pathname) {
      return NextResponse.redirect(targetUrl);
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/company/login", req.url));
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
