import axios from "axios";
import { cookies } from "next/headers";
import { getSession } from "@/lib/iron-session/getSession";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * Returns a configured axios instance with:
 * - Authorization header using the current session access token
 * - Automatic 401 retry with token refresh (read-only for session)
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

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle company suspension (403)
      if (error.response?.status === 403) {
        error.isSuspended = true;
        return Promise.reject(error);
      }

      // Handle 401: Just reject and let the middleware or page handle it.
      // We cannot modify cookies (session.destroy/save) here during render.
      if (error.response?.status === 401) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return api;
}
