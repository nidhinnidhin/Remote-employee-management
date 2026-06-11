"use server";

import { getMyDepartments } from "@/services/employee/department/department.service";
import { Department } from "@/shared/types/company/department.types";
import { getServerApi } from "@/lib/axios/axiosServer";

export interface DashboardResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const getMyDepartmentsAction = async (): Promise<DashboardResponse<Department[]>> => {
  try {
    const api = await getServerApi();
    const departments = await getMyDepartments(api);
    return { success: true, data: departments };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error("Error fetching my departments:", error);
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Failed to fetch your departments"
    };
  }
};
