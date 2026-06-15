"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import * as commentService from "@/services/employee/project/comment.service";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";

export const getCommentsAdminAction = async (
  entityType: CommentEntityType,
  entityId: string,
): Promise<{ success: boolean; data?: Comment[]; error?: string }> => {
  try {
    const api = await getServerApi();
    const result = await commentService.getComments(entityType, entityId, api);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Failed to fetch comments.",
    };
  }
};

export const addCommentAdminAction = async (
  formData: FormData, // 👈 Fixed: Now accepts FormData to prevent Type mismatch ts(2345)
): Promise<{ success: boolean; data?: Comment; error?: string }> => {
  try {
    const api = await getServerApi();

    // Reconstruct a clean FormData payload to strip out implicit Next.js layout properties
    const apiPayload = new FormData();
    apiPayload.append("entityId", formData.get("entityId") as string);
    apiPayload.append("entityType", formData.get("entityType") as string);
    apiPayload.append("content", formData.get("content") as string);
    
    const parentId = formData.get("parentId");
    if (parentId) {
      apiPayload.append("parentId", parentId as string);
    }

    // Capture binary streams and append them using the key expected by NestJS 'files' interceptor
    const files = formData.getAll("files") as File[];
    files.forEach((file) => {
      apiPayload.append("files", file);
    });

    // Dispatches the multi-part data payload safely downstream to the service layer
    const result = await commentService.addComment(apiPayload, api);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string | string[] } };
      message?: string;
    };
    let userFriendlyMessage = "Failed to add comment.";
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