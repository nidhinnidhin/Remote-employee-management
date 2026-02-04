import { api } from "@/lib/axiosInstance";

export const setEmployeePassword = async (password: string) => {
  const response = await api.post(
    "/company/employees/set-password",
    { password }
  );

  return response.data;
};
