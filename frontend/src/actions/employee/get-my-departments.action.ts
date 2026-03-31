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
  } catch (error: any) {
    console.error("Error fetching my departments:", error);
    return { success: false, error: error.message || "Failed to fetch departments" };
  }
};
