export enum CommentEntityType {
  PROJECT = 'PROJECT',
  USER_STORY = 'USER_STORY',
  TASK = 'TASK',
}

export interface Comment {
  id?: string;
  _id?: string;
  companyId: string;
  entityId: string;
  entityType: CommentEntityType;
  parentId?: string;
  attachments?: string[];
  authorId: string;
  authorName?: string;
  content: string;
  reactions?: { emoji: string; userIds: string[] }[];
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface CreateCommentDto {
  entityId: string;
  entityType: CommentEntityType;
  content: string;
  parentId?: string;
}
