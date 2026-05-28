export enum NotificationType {
  PROJECT_ASSIGNED = 'PROJECT_ASSIGNED',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  STORY_ASSIGNED = 'STORY_ASSIGNED',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  NEW_MESSAGE = 'NEW_MESSAGE',
}

export class NotificationEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly recipientId: string,
    public readonly message: string,
    public readonly type: NotificationType,
    public readonly isRead: boolean = false,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
