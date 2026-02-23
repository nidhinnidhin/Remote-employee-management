import axios from "axios";
import { cookies } from "next/headers";
import { getSession } from "@/lib/iron-session/getSession";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

async function tryRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(COOKIE_KEYS.REFRESH_TOKEN)?.value;

    if (!refreshToken) return null;

    const response = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Cookie: `${COOKIE_KEYS.REFRESH_TOKEN}=${refreshToken}`,
        },
      }
    );

    const { accessToken } = response.data;
    if (!accessToken) return null;

    // Persist new access token to iron-session
    const session = await getSession();
    session.accessToken = accessToken;
    await session.save();

    // Also update the access_token HTTP-only cookie
    const isProd = process.env.NODE_ENV === "production";
    cookieStore.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
    });

    return accessToken;
  } catch {
    return null;
  }
}

/**
 * Returns a configured axios instance with:
 * - Authorization header using the current session access token
 * - Automatic 401 retry with token refresh
 * - 403 suspension detection
 */
export async function getServerApi() {
  const session = await getSession();

  if (!session.accessToken) {
    throw new Error("Unauthorized");
  }

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  let isRefreshing = false;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle company suspension (403)
      if (error.response?.status === 403) {
        error.isSuspended = true;
        return Promise.reject(error);
      }

      // Handle expired access token (401) — attempt refresh once
      if (
        error.response?.status === 401 &&
        !originalRequest._retried &&
        !isRefreshing
      ) {
        originalRequest._retried = true;
        isRefreshing = true;

        const newToken = await tryRefreshToken();
        isRefreshing = false;

        if (newToken) {
          // Retry the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        }

        // Refresh failed — clear session so middleware redirects to login
        const session = await getSession();
        await session.destroy();
      }

      return Promise.reject(error);
    }
  );

  return api;
}
