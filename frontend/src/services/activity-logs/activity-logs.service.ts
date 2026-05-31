import { AxiosInstance } from "axios";
import { ActivityLog } from "@/shared/types/activity-log.type";

export class ActivityLogsService {
  static async getEmployeeLogs(api: AxiosInstance): Promise<ActivityLog[]> {
    const response = await api.get("/activity-logs/employee");
    return response.data;
  }

  static async getCompanyAdminLogs(api: AxiosInstance): Promise<ActivityLog[]> {
    const response = await api.get("/activity-logs/company-admin");
    return response.data;
  }

  static async getSuperAdminLogs(api: AxiosInstance): Promise<ActivityLog[]> {
    const response = await api.get("/activity-logs/super-admin");
    return response.data;
  }
}
