import { api } from "@/lib/axiosInstance";
import { LoginPayload } from "@/types/auth/company-login/login-payload.type";

export async function loginUser(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);
  return response;
}