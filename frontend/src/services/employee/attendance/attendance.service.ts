import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { AxiosInstance } from "axios";

export const clockIn = async (remarks?: string, api: AxiosInstance = clientApi): Promise<AttendanceLog> => {
  const response = await api.post(API_ROUTES.ATTENDANCE.CLOCK_IN, { remarks });
  return response.data;
};

export const clockOut = async (api: AxiosInstance = clientApi): Promise<AttendanceLog> => {
  const response = await api.post(API_ROUTES.ATTENDANCE.CLOCK_OUT);
  return response.data;
};

export const startBreak = async (
  breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA',
  remarks?: string,
  api: AxiosInstance = clientApi
): Promise<AttendanceLog> => {
  const response = await api.post(API_ROUTES.ATTENDANCE.BREAK_START, { breakType, remarks });
  return response.data;
};

export const endBreak = async (api: AxiosInstance = clientApi): Promise<AttendanceLog> => {
  const response = await api.post(API_ROUTES.ATTENDANCE.BREAK_END);
  return response.data;
};

export const getTodayAttendance = async (api: AxiosInstance = clientApi): Promise<AttendanceLog | null> => {
  const response = await api.get(API_ROUTES.ATTENDANCE.TODAY);
  return response.data;
};

export interface GetMyLogsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface AttendanceLogsResponse {
  data: AttendanceLog[];
  total: number;
}

export const getMyLogs = async (
  params?: GetMyLogsParams,
  api: AxiosInstance = clientApi
): Promise<AttendanceLogsResponse> => {
  const response = await api.get(API_ROUTES.ATTENDANCE.MY_LOGS, { params });
  return response.data;
};
