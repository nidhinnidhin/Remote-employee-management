import { api } from "@/lib/axiosInstance";

export async function verifyOtp(payload: { email: string; otp: string }) {
  return api.post("/auth/verify-otp", payload);
}
