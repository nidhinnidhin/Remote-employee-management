import { clientApi } from "@/lib/axios/axiosClient";

export async function resetPasswordService(payload: {
  email: string;
  newPassword: string;
}) {
  return clientApi.post("/auth/reset-password", payload);
}