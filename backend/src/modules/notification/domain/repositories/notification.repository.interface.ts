import { NotificationEntity } from '../entities/notification.entity';

export interface INotificationRepository {
  create(notification: Partial<NotificationEntity>): Promise<NotificationEntity>;
  findById(id: string, companyId: string): Promise<NotificationEntity | null>;
  findByUser(userId: string, companyId: string): Promise<NotificationEntity[]>;
  getUnreadCount(userId: string, companyId: string): Promise<number>;
  markAsRead(id: string, companyId: string): Promise<NotificationEntity | null>;
  markAllAsRead(userId: string, companyId: string): Promise<boolean>;
  delete(id: string, companyId: string): Promise<boolean>;
}
