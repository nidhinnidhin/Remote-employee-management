import { api } from "@/lib/axios/axiosInstance";
import { LoginPayload } from "@/shared/types/company/auth/company-login/login-payload.type";

export async function loginUser(payload: LoginPayload) {
  const response = await api.post("/auth/login", payload);
  return response;
}