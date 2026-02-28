import { clientApi } from "@/lib/axios/axiosClient";
import { VerifyEmployeeInviteResponse } from "@/shared/types/company/employees/auth/invite-employee-verifier-props.type";

export const verifyEmployeeInvite = async (token: string) => {
  const response = await clientApi.get<VerifyEmployeeInviteResponse>(
    "/company/employees/verify-invite",
    {
      params: { token },
    },
  );

  return response.data;
};
