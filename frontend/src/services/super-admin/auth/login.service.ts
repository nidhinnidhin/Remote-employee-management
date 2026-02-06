import { api } from "@/lib/axiosInstance";

export async function superAdminLogin(payload: {
  email: string;
  password: string;
}) {
  return api.post("/super-admin/auth/login", payload);
}
