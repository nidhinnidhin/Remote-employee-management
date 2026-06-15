import axios from "axios";
import { API_ROUTES } from "@/constants/api.routes";

// API_URL_INTERNAL is server-only (no NEXT_PUBLIC_ prefix).
// On the server: resolves to http://backend:4000/api (Docker internal network).
// In the browser: process.env.API_URL_INTERNAL is undefined → falls back to localhost.
export const clientApi = axios.create({
  baseURL: process.env.API_URL_INTERNAL || "http://localhost:4000/api",
  withCredentials: true,
});

clientApi.interceptors.response.use(
  (res) => {
    // Standard response handling: Automatically unwrap 'data' ONLY if it's a standardized wrapper
    // This provides 100% backward compatibility with zero code changes needed in components.
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
  async (err) => {
    const originalRequest = err.config;
    console.log("CLIENT API ERROR:", {
      url: originalRequest?.url,
      status: err.response?.status,
      method: originalRequest?.method,
    });
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH) &&
      !originalRequest.url?.includes(API_ROUTES.COMPANY.EMPLOYEES.VERIFY_INVITE)
    ) {
      originalRequest._retry = true;
      try {
        await clientApi.post(API_ROUTES.AUTH.REFRESH);
        return clientApi(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }

    if (err.response?.status === 403) {
      if (typeof window !== "undefined") {
        const message = err.response.data?.message || "";
        const isBlocked = message.includes("blocked") || message.includes("Blocked");
        const isSuspended = message.includes("suspended") || message.includes("Suspended");

        // Only redirect to login for genuine account status errors.
        // Other 403s (e.g. subscription limits, role permissions) should
        // be rejected normally so the calling component can handle them.
        if (isBlocked || isSuspended) {
          const errorType = isBlocked ? "blocked" : "suspended";
          window.location.href = `/auth/login?error=${errorType}`;
        }
      }
    }

    return Promise.reject(err);
  }
);
