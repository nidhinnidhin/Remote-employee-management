"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import * as commentService from "@/services/employee/project/comment.service";
import { Comment, CommentEntityType } from "@/shared/types/company/projects/comment.type";

export const getCommentsAction = async (
  entityType: CommentEntityType,
  entityId: string,
): Promise<{ success: boolean; data?: Comment[]; error?: string }> => {
  try {
    const api = await getServerApi();
    const result = await commentService.getComments(entityType, entityId, api);
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return {
      success: false,
      error: err.response?.data?.message || err.message || "Failed to load comments.",
    };
  }
};

export const addCommentAction = async (
  formData: FormData,
): Promise<{ success: boolean; data?: Comment; error?: string }> => {
  try {
    const api = await getServerApi();

    // Reconstruct the exact FormData layout array to eliminate hidden NextJS boundary payloads
    const apiPayload = new FormData();
    apiPayload.append("entityId", formData.get("entityId") as string);
    apiPayload.append("entityType", formData.get("entityType") as string);
    apiPayload.append("content", formData.get("content") as string);
    
    const parentId = formData.get("parentId");
    if (parentId) {
      apiPayload.append("parentId", parentId as string);
    }

    const files = formData.getAll("files") as File[];
    files.forEach((file) => {
      apiPayload.append("files", file); 
    });

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