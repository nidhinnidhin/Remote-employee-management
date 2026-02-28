import { clientApi } from "@/lib/axios/axiosClient";

export async function verifyOtp(payload: { email: string; otp: string }) {
  return clientApi.post("/auth/verify-otp", payload);
}
