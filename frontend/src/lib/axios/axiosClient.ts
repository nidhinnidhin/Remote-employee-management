import axios from "axios";
import { API_ROUTES } from "@/constants/api.routes";

// Track whether a refresh is already in-flight to prevent concurrent retries
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

function processQueue(error: unknown | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
}

// API_URL_INTERNAL is server-only (no NEXT_PUBLIC_ prefix).
// On the server: resolves to http://backend:4000/api (Docker internal network).
// In the browser: process.env.API_URL_INTERNAL is undefined → falls back to localhost.
export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  withCredentials: true,
  // Ensure Next.js patched fetch sends credentials
  fetchOptions: {
    credentials: "include",
  },
} as any);

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

    // ── 403 handling (blocked / suspended accounts) ──────────────────────────
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
      return Promise.reject(err);
    }

    // ── 401 handling — attempt token refresh ─────────────────────────────────
    // Do not attempt refresh for:
    // - Non-401 errors
    // - Requests that have already been retried
    // - The refresh route itself (avoid infinite loop)
    // - Public invite verification routes
    if (
      err.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/api/auth/refresh") ||
      originalRequest.url?.includes(API_ROUTES.COMPANY.EMPLOYEES.VERIFY_INVITE)
    ) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      // Another refresh is already in-flight: queue this request and wait
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => clientApi(originalRequest))
        .catch((e) => Promise.reject(e));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // ✅ Call the Next.js API route — this correctly reads the refresh_token
      //    cookie AND updates the iron-session so the proxy sees the new token.
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error("Refresh failed with status " + refreshRes.status);
      }

      processQueue(null);
      // Retry the original failed request with the refreshed session
      return clientApi(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);