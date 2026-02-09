import { clientApi } from "@/lib/axios/axiosClient";

export const setEmployeePassword = async (password: string) => {
  const response = await clientApi.post(
    "/company/employees/set-password",
    { password }
  );

  return response.data;
};
