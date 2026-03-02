import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export async function forgotPasswordService(payload: { email: string }) {
  return clientApi.post(API_ROUTES.AUTH.PASSWORD.FORGOT, payload);
}

