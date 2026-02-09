import { clientApi } from "@/lib/axios/axiosClient";

const superAdminLogin = async (email: string, password: string) => {
  return clientApi.post("/super-admin/auth/login", {
    email,
    password,
  });
};

export default superAdminLogin;
