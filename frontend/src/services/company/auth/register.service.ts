import { clientApi } from "@/lib/axios/axiosClient";
import { RegisterCompanyResponse } from "@/shared/types/company/auth/company-registeration/reegister-response.type";
import { RegisterCompanyPayload } from "@/shared/types/company/auth/company-registeration/register-company-payload.type";
import { AxiosError } from "axios";

export async function registerAdmin(
  payload: any,
): Promise<any> {
  try {
    const response = await clientApi.post<any>(
      "/auth/register",
      payload,
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<any>;

    const message =
      err.response?.data?.message || "Registration failed. Please try again.";

    throw new Error(message);
  }
}
