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

export interface DecideLateRequestDto {
  attendanceId: string;
  status: "APPROVED" | "REJECTED";
  decision?: "APPROVED" | "REJECTED";
  adminRemarks?: string;
}

export const decideLateRequest = async (
  data: DecideLateRequestDto,
  api: AxiosInstance = clientApi
): Promise<AttendanceLog> => {
  const payload = {
    ...data,
    decision: data.status,
  };
  const response = await api.post(API_ROUTES.ATTENDANCE.DECIDE_REQUEST, payload);
  return response.data;
};
