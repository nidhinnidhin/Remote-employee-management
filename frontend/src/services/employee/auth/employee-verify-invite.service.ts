import { api } from "@/lib/axios/axiosInstance";
import { VerifyEmployeeInviteResponse } from "@/shared/types/company/employees/auth/invite-employee-verifier-props.type";

export const verifyEmployeeInvite = async (token: string) => {
  const response = await api.get<VerifyEmployeeInviteResponse>(
    "/company/employees/verify-invite",
    {
      params: { token },
    },
  );

  return response.data;
};
