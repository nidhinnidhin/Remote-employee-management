import { api } from "@/lib/axiosInstance";

export async function resendOtp(payload: { email: string }) {
  return api.post("/auth/resend-otp", payload);
}