import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export async function resendOtp(payload: { email: string }) {
  return clientApi.post(API_ROUTES.AUTH.OTP.RESEND, payload);
}