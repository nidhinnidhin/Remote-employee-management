export enum NotificationType {
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  STORY_ASSIGNED = 'STORY_ASSIGNED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export interface Notification {
  id: string;
  companyId: string;
  recipientId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
