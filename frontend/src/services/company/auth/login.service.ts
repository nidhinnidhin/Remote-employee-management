import { clientApi } from "@/lib/axios/axiosClient";
import { LoginPayload } from "@/shared/types/company/auth/company-login/login-payload.type";
import { API_ROUTES } from "@/constants/api.routes";

export async function loginUser(payload: LoginPayload) {
  const response = await clientApi.post(API_ROUTES.AUTH.LOGIN, payload);
  return response;
}