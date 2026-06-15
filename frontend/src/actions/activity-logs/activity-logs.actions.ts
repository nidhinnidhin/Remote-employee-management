"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { ActivityLogsService } from "@/services/activity-logs/activity-logs.service";

export const getEmployeeLogsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ActivityLogsService.getEmployeeLogs(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching employee logs:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch logs" };
  }
};

export const getCompanyAdminLogsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ActivityLogsService.getCompanyAdminLogs(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching company admin logs:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch logs" };
  }
};

export const getSuperAdminLogsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await ActivityLogsService.getSuperAdminLogs(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching super admin logs:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch logs" };
  }
};
