import { api } from "@/lib/axiosInstance";

export async function registerUser(payload: any) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}