import axios from "axios";
import { API_ROUTES } from "@/constants/api.routes";

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

clientApi.interceptors.response.use(
  (res) => res,
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
        const errorType = isBlocked ? "blocked" : "suspended";
        window.location.href = `/auth/login?error=${errorType}`;
      }
    }

    return Promise.reject(err);
  }
);
