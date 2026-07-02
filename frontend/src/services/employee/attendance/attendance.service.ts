import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { AttendanceLog } from "@/shared/types/attendance/attendance.types";
import { AxiosInstance } from "axios";

export interface ClockInResult {
  success: boolean;
  data?: AttendanceLog;
  error?: string;
}

export const clockIn = async (
  remarks?: string,
  lateReason?: string,
  api: AxiosInstance = clientApi
): Promise<ClockInResult> => {
  try {
    const response = await api.post(API_ROUTES.ATTENDANCE.CLOCK_IN, { remarks, lateReason });
    return { success: true, data: response.data };
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string };
    const errMsg = e.response?.data?.message || e.message || "Failed to Clock In.";
    return { success: false, error: errMsg };
  }
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
  status?: string;
  search?: string;
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

export const requestEarlyOut = async (
  reason: string,
  api: AxiosInstance = clientApi
): Promise<ClockInResult> => {
  try {
    const response = await api.post(API_ROUTES.ATTENDANCE.REQUEST_EARLY_OUT, { reason });
    return { success: true, data: response.data };
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string };
    const errMsg = e.response?.data?.message || e.message || "Failed to submit early out request.";
    return { success: false, error: errMsg };
  }
};

export const requestBreak = async (
  breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA',
  reason: string,
  api: AxiosInstance = clientApi
): Promise<ClockInResult> => {
  try {
    const response = await api.post(API_ROUTES.ATTENDANCE.REQUEST_BREAK, { breakType, reason });
    return { success: true, data: response.data };
  } catch (err: unknown) {
    const e = err as { response?: { data?: { message?: string } }; message?: string };
    const errMsg = e.response?.data?.message || e.message || "Failed to submit break request.";
    return { success: false, error: errMsg };
  }
};
