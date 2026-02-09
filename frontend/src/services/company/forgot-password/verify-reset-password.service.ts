import { api } from "@/lib/axios/axiosInstance";

export async function verifyResetPasswordOtpService(payload: {
  email: string;
  otp: string;
}) {
  return api.post("/auth/verify-reset-password-otp", payload);
}