import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { Department } from "@/shared/types/company/department.types";
import { AxiosInstance } from "axios";

export const getMyDepartments = async (api: AxiosInstance = clientApi): Promise<Department[]> => {
  const response = await api.get(API_ROUTES.COMPANY.DEPARTMENTS.GET_MY_DEPARTMENTS);
  return response.data;
};
