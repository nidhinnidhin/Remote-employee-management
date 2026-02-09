import { api } from "@/lib/axios/axiosInstance";

export async function resetPasswordService(payload: {
  email: string;
  newPassword: string;
}) {
  return api.post("/auth/reset-password", payload);
}