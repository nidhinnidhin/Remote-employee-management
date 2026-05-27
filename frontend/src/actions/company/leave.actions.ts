"use server";

import {
  getCompanyLeaves,
  approveLeaveRequest,
  rejectLeaveRequest,
  AdminLeaveRequest,
} from "@/services/company/leave/leave.service";
import { revalidatePath } from "next/cache";

export async function getAdminLeaveLogsAction(params: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  employeeId?: string;
}): Promise<{ success: boolean; data?: { data: AdminLeaveRequest[]; total: number }; error?: string }> {
  try {
    const data = await getCompanyLeaves(params);
    console.log("tgrrhfghfgdhdfghdfhfh")
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch company leaves",
    };
  }
}

export async function approveLeaveAction(id: string, adminMessage?: string) {
  try {
    const data = await approveLeaveRequest(id, adminMessage);
    revalidatePath("/company-admin/attendance");
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to approve leave request",
    };
  }
}

export async function rejectLeaveAction(id: string, adminMessage: string) {
  try {
    const data = await rejectLeaveRequest(id, adminMessage);
    revalidatePath("/company-admin/attendance");
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reject leave request",
    };
  }
}

