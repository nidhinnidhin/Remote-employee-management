import { api } from "@/lib/axiosInstance";

const superAdminLogin = async (email: string, password: string) => {
  return api.post("/super-admin/auth/login", {
    email,
    password,
  });
};

export default superAdminLogin;
