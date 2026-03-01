import { clientApi } from "@/lib/axios/axiosClient";

export async function forgotPasswordService(payload: { email: string }) {
  return clientApi.post("/auth/password/forgot", payload);
}

