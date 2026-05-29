"use server";

import { revalidatePath } from "next/cache";
import { getServerApi } from "@/lib/axios/axiosServer";
import * as commentService from "@/services/employee/project/comment.service";
import { Comment, CreateCommentDto, CommentEntityType } from "@/shared/types/company/projects/comment.type";

export const getCommentsAction = async (
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

export const addCommentAction = async (
  payload: CreateCommentDto,
): Promise<{ success: boolean; data?: Comment; error?: string }> => {
  try {
    const api = await getServerApi();
    const result = await commentService.addComment(payload, api);
    
    // Optional: We can revalidate path if we want server components to refetch
    // But mostly this will be handled by client side state in the modal
    // revalidatePath("/employee/projects");
    
    return { success: true, data: result };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: any } };
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
