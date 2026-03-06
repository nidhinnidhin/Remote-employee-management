import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export async function resetPasswordService(payload: {
  email: string;
  newPassword: string;
}) {
  return clientApi.post(API_ROUTES.AUTH.PASSWORD.RESET, payload);
}