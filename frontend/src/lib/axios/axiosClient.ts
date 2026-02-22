import axios from "axios";

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

clientApi.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await clientApi.post("/auth/refresh");
        return clientApi(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          window.location.href = "/company/login";
        }
      }
    }

    if (err.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/company/login";
      }
    }

    return Promise.reject(err);
  }
);
