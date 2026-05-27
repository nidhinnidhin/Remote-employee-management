import { getServerApi } from "@/lib/axios/axiosServer";
import { LeaveRequest } from "@/types/leave.types";
import { API_ROUTES } from "@/constants/api.routes";

export const getCompanyLeaves = async (params: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  employeeId?: string;
}): Promise<{ data: AdminLeaveRequest[]; total: number }> => {
  const api = await getServerApi();
  const response = await api.get(API_ROUTES.LEAVES.COMPANY_LEAVES, { params });
  return response.data;
};

export const approveLeaveRequest = async (id: string, adminMessage?: string): Promise<LeaveRequest> => {
  const api = await getServerApi();
  const response = await api.put(API_ROUTES.LEAVES.APPROVE(id), { adminMessage });
  return response.data;
};

export const rejectLeaveRequest = async (id: string, adminMessage: string): Promise<LeaveRequest> => {
  const api = await getServerApi();
  const response = await api.put(API_ROUTES.LEAVES.REJECT(id), { adminMessage });
  return response.data;
};

// Admin-side leave request (with populated employeeId)
export interface AdminLeaveRequest extends Omit<LeaveRequest, 'employeeId'> {
  employeeId: {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
}
