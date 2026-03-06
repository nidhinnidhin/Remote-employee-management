import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export async function verifyOtp(payload: { email: string; otp: string }) {
  return clientApi.post(API_ROUTES.AUTH.OTP.VERIFY, payload);
}
