import axios from "axios";

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
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/company/employees/verify-invite")
    ) {
      originalRequest._retry = true;
      try {
        await clientApi.post("/auth/refresh");
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
