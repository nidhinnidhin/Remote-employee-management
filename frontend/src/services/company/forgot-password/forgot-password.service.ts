import { api } from "@/lib/axiosInstance";

export async function forgotPasswordService(payload: { email: string }) {
  return api.post("/auth/forgot-password", payload);
}

