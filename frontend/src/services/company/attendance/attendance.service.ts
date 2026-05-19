import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { AxiosInstance } from "axios";

export interface GetAdminLogsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  status?: string;
  search?: string;
}

export interface AdminAttendanceLogsResponse {
  data: AttendanceLog[];
  total: number;
}

export const getAdminLogs = async (
  params?: GetAdminLogsParams,
  api: AxiosInstance = clientApi
): Promise<AdminAttendanceLogsResponse> => {
  const response = await api.get(API_ROUTES.ATTENDANCE.ADMIN_LOGS, { params });
  return response.data;
};
