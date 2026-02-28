import { clientApi } from "@/lib/axios/axiosClient";
import { LoginPayload } from "@/shared/types/company/auth/company-login/login-payload.type";

export async function loginUser(payload: LoginPayload) {
  const response = await clientApi.post("/auth/login", payload);
  return response;
}