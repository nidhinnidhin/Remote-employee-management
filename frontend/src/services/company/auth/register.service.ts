import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { AxiosError } from "axios";

export async function registerAdmin(
  payload: any,
): Promise<any> {
  try {
    const response = await clientApi.post<any>(
      API_ROUTES.AUTH.REGISTER,
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
