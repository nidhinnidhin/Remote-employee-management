import { clientApi } from "@/lib/axios/axiosClient";

export async function verifyResetPasswordOtpService(payload: {
  email: string;
  otp: string;
}) {
  return clientApi.post("/auth/password/verify-reset", payload);
}