import { clientApi } from "@/lib/axios/axiosClient";

export async function resendOtp(payload: { email: string }) {
  return clientApi.post("/auth/otp/resend", payload);
}