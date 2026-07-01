import axios from "axios";
import { cookies } from "next/headers";
import { getSession } from "@/lib/iron-session/getSession";
import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";

// API_URL_INTERNAL is read at runtime (not baked in at build time).
// In Docker: resolves to http://backend:4000/api via the internal Docker network.
// Outside Docker / local non-Docker dev: falls back to http://localhost:4000/api.
const BASE_URL = process.env.API_URL_INTERNAL || "http://localhost:4000/api";

export async function getServerApi() {
  const session = await getSession();

  if (!session.accessToken) {
    throw new Error("Unauthorized");
  }

  console.log("access token",session.accessToken)

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  api.interceptors.response.use(
    (res) => {
      if (
        res.data &&
        typeof res.data === 'object' &&
        res.data.success === true &&
        'data' in res.data &&
        'message' in res.data
      ) {
        res.data = res.data.data;
      }
      return res;
    },
    async (error) => {
      if (error.response?.status === 403) {
        error.isSuspended = true;
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return api;
}

/**
 * A plain (no-auth) axios instance for use inside "use server" actions
 * (e.g. login, onboard) that need to call the backend before a session exists.
 *
 * Uses API_URL_INTERNAL so it resolves correctly inside Docker
 * (http://backend:4000/api) instead of trying to reach localhost,
 * which inside a container points to the frontend container itself.
 */
export const serverActionApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});