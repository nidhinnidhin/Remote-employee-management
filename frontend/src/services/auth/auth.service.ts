import { apiClient } from "@/src/lib/api-client";
import { ApiResponse, CompanyRegistrationPayload } from "@/src/types/auth/company-registeration/auth.types";

export const registerCompanyAdmin = async (
  payload: CompanyRegistrationPayload,
): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>(
    "/company/register",
    payload,
  );
  return response.data;
};
