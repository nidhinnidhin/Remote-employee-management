import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { 
  BackendApplyLeaveDto, 
  LeaveFilterParams, 
  LeaveRequest, 
  PaginatedLeaveResponse,
  LeaveBalance 
} from "@/types/leave.types";
import { AxiosInstance } from "axios";

export const applyLeave = async (
  dto: BackendApplyLeaveDto,
  api: AxiosInstance = clientApi
): Promise<LeaveRequest> => {
  const response = await api.post(API_ROUTES.LEAVES.APPLY, dto);
  // Safely extracts data whether wrapped by NestJS Interceptors or bare returns
  return response.data?.data ?? response.data;
};

export const getMyLeaves = async (
  params?: LeaveFilterParams,
  api: AxiosInstance = clientApi
): Promise<PaginatedLeaveResponse> => {
  const response = await api.get(API_ROUTES.LEAVES.MY_LEAVES, { params });
  console.log('---------------',response)
  return response.data?.data ?? response.data;
};

export const getMyBalance = async (
  api: AxiosInstance = clientApi
): Promise<LeaveBalance[]> => {
  const response = await api.get(API_ROUTES.LEAVES.MY_BALANCE);
  return response.data?.data ?? response.data;
};

export const cancelLeave = async (
  id: string,
  api: AxiosInstance = clientApi
): Promise<LeaveRequest> => {
  const response = await api.delete(API_ROUTES.LEAVES.CANCEL(id));
  return response.data?.data ?? response.data;
};

export const getLeaveById = async (
  id: string,
  api: AxiosInstance = clientApi
): Promise<LeaveRequest> => {
  const response = await api.get(API_ROUTES.LEAVES.DETAIL(id));
  return response.data?.data ?? response.data;
};