import { AxiosInstance } from "axios";
import { Comment, CreateCommentDto, CommentEntityType } from "@/shared/types/company/projects/comment.type";

export const getComments = async (
  entityType: CommentEntityType,
  entityId: string,
  api: AxiosInstance,
): Promise<Comment[]> => {
  const { data } = await api.get(`/comments/${entityType}/${entityId}`);
  return data;
};

export const addComment = async (
  payload: CreateCommentDto | FormData, // Updated to accept multipart FormData
  api: AxiosInstance,
): Promise<Comment> => {
  const { data } = await api.post(`/comments`, payload, {
    headers: payload instanceof FormData 
      ? { "Content-Type": "multipart/form-data" } 
      : undefined,
  });
  return data;
};