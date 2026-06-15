"use server";

import { revalidatePath } from "next/cache";
import {
  BackendApplyLeaveDto,
  LeaveFilterParams,
  LeaveRequest,
  PaginatedLeaveResponse,
  LeaveBalance,
} from "@/types/leave.types";
import * as leaveService from "@/services/employee/leave/leave.service";
import { getServerApi } from "@/lib/axios/axiosServer";

/**
 * Handles processing binary File tracks from FormData and uploading them to your cloud storage bucket.
 * Modify this function to route to your AWS S3, Cloudinary, or custom upload routes.
 */
async function uploadAttachmentsToCloud(files: File[]): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    // Skip empty or unselected file objects safely
    if (!file || file.size === 0 || !file.name) continue;

    // Example integration using external CDN uploads:
    // const payload = new FormData();
    // payload.append("file", file);
    // const res = await fetch("https://api.yourstorage.com/upload", { method: "POST", body: payload });
    // const parsed = await res.json();
    // uploadedUrls.push(parsed.secure_url);

    // Placeholder mock generation mirroring cloud URLs paths:
    uploadedUrls.push(
      `https://storage.yourcompany.com/leave-attachments/${Date.now()}-${file.name}`,
    );
  }

  return uploadedUrls;
}

export const applyLeaveAction = async (
  formData: FormData,
): Promise<{ success: boolean; data?: LeaveRequest; error?: string }> => {
  try {
    // 1. Process files securely out of FormData pipeline
    const rawFiles = formData.getAll("attachments") as File[];
    const attachmentUrls = await uploadAttachmentsToCloud(rawFiles);

    const backendDto: BackendApplyLeaveDto = {
      leaveType: formData.get("leaveType") as string, 
      startDate: new Date(formData.get("startDate") as string).toISOString(),
      endDate: new Date(formData.get("endDate") as string).toISOString(),
      durationType: formData.get("durationType") as any,
      totalDays: Number(formData.get("totalDays") || 1),
      reason: formData.get("reason") as string,
      attachments: attachmentUrls,
      emergencyContact: {
        name: formData.get("emergencyContactName") as string,
        phone: formData.get("emergencyContactPhone") as string,
      },
    };

    const api = await getServerApi();
    const result = await leaveService.applyLeave(backendDto, api);

    revalidatePath("/employee/leaves");
    revalidatePath("/employee/dashboard");

    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: any } };
      message?: string;
    };

    let userFriendlyMessage = "Failed to apply for leave.";
    if (err.response?.data?.message) {
      userFriendlyMessage =
        typeof err.response.data.message === "object"
          ? JSON.stringify(err.response.data.message)
          : err.response.data.message;
    } else if (err.message) {
      userFriendlyMessage = err.message;
    }

    return { success: false, error: userFriendlyMessage };
  }
};

export const cancelLeaveAction = async (
  id: string,
): Promise<{ success: boolean; data?: LeaveRequest; error?: string }> => {
  try {
    const api = await getServerApi();
    const result = await leaveService.cancelLeave(id, api);

    revalidatePath("/employee/leaves");
    revalidatePath("/employee/dashboard");

    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || "Failed to cancel leave.",
    };
  }
};

export const getMyLeavesAction = async (
  params?: LeaveFilterParams,
): Promise<{
  success: boolean;
  data?: PaginatedLeaveResponse;
  error?: string;
}> => {
  try {
    const api = await getServerApi();
    const result = await leaveService.getMyLeaves(params, api);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      error:
        err.response?.data?.message || err.message || "Failed to fetch leaves.",
    };
  }
};

export const getMyLeaveBalanceAction = async (): Promise<{
  success: boolean;
  data?: LeaveBalance[];
  error?: string;
}> => {
  try {
    const api = await getServerApi();
    const result = await leaveService.getMyBalance(api);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch leave balance.",
    };
  }
};
