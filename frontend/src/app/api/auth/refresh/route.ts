import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session/session";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.API_URL_INTERNAL || "http://backend:4000/api";

export async function POST(req: NextRequest) {
  // 1. Read the refresh_token from the incoming browser cookies
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // 2. Also check the iron-session (fallback: stored during login)
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  const sessionRefreshToken = session.refreshToken;

  const tokenToUse = refreshToken ?? sessionRefreshToken;

  if (!tokenToUse) {
    console.log("[/api/auth/refresh] No refresh token found in cookies or session.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. Call the backend refresh endpoint
    const backendResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${tokenToUse}`,
      },
    });

    if (!backendResponse.ok) {
      const errorBody = await backendResponse.json().catch(() => ({}));
      console.log("[/api/auth/refresh] Backend refresh failed:", backendResponse.status, errorBody);

      // Clear the stale session on permanent failure
      session.accessToken = undefined;
      await session.save();

      return NextResponse.json(
        { message: "Refresh failed", detail: errorBody },
        { status: 401 }
      );
    }

    const body = await backendResponse.json();
    // Backend returns: { success: true, data: { accessToken } } OR { accessToken }
    const newAccessToken =
      body?.data?.accessToken ?? body?.accessToken ?? null;

    if (!newAccessToken) {
      console.log("[/api/auth/refresh] Backend returned ok but no accessToken in body:", body);
      return NextResponse.json({ message: "No access token in response" }, { status: 401 });
    }

    // 4. ✅ Update the iron-session with the new access token
    //    We are inside a real Next.js API route, so session.save() works correctly.
    session.accessToken = newAccessToken;
    await session.save();

    console.log("[/api/auth/refresh] ✅ Session updated with new access token.");

    // 5. Forward any Set-Cookie headers from the backend (e.g. new access_token cookie)
    const response = NextResponse.json({ success: true });
    const backendSetCookie = backendResponse.headers.get("set-cookie");
    if (backendSetCookie) {
      response.headers.set("set-cookie", backendSetCookie);
    }

    return response;
  } catch (err) {
    console.error("[/api/auth/refresh] Unexpected error:", err);
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
