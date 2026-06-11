import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { AxiosError } from "axios";

export interface RegisterAdminPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface RegisterAdminResponse {
  userId?: string;
  id?: string;
  message?: string;
  [key: string]: unknown;
}

export async function registerAdmin(
  payload: RegisterAdminPayload,
): Promise<RegisterAdminResponse> {
  try {
    const response = await clientApi.post<RegisterAdminResponse>(
      API_ROUTES.AUTH.REGISTER,
      payload,
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message?: string }>;

    const message =
      err.response?.data?.message || "Registration failed. Please try again.";

    throw new Error(message);
  }
}
