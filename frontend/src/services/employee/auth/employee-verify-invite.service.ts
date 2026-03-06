import { clientApi } from "@/lib/axios/axiosClient";
import { VerifyEmployeeInviteResponse } from "@/shared/types/company/employees/auth/invite-employee-verifier-props.type";
import { API_ROUTES } from "@/constants/api.routes";

export const verifyEmployeeInvite = async (token: string) => {
  const response = await clientApi.get<VerifyEmployeeInviteResponse>(
    API_ROUTES.COMPANY.EMPLOYEES.VERIFY_INVITE,
    {
      params: { token },
    },
  );

  return response.data;
};
