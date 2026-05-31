"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { ActivityLogsService } from "@/services/activity-logs/activity-logs.service";

export const getEmployeeLogsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ActivityLogsService.getEmployeeLogs(api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching employee logs:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch logs" };
  }
};

export const getCompanyAdminLogsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ActivityLogsService.getCompanyAdminLogs(api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching company admin logs:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch logs" };
  }
};

export const getSuperAdminLogsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ActivityLogsService.getSuperAdminLogs(api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching super admin logs:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch logs" };
  }
};
