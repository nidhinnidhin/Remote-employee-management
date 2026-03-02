import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export async function verifyResetPasswordOtpService(payload: {
  email: string;
  otp: string;
}) {
  return clientApi.post(API_ROUTES.AUTH.PASSWORD.VERIFY_RESET, payload);
}