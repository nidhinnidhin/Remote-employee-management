import { api } from "@/lib/axiosInstance";
import { RegisterCompanyResponse } from "@/types/auth/company-registeration/reegister-response.type";
import { RegisterCompanyPayload } from "@/types/auth/company-registeration/register-company-payload.type";

export async function registerUser(
  payload: RegisterCompanyPayload,
): Promise<RegisterCompanyResponse> {
  const response = await api.post<RegisterCompanyResponse>(
    "/auth/register",
    payload,
  );
  return response.data;
}
