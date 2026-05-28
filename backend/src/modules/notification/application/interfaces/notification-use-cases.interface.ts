import { NotificationEntity } from '../../domain/entities/notification.entity';
import { CreateNotificationDto } from '../dto/create-notification.dto';

export interface ICreateNotificationUseCase {
  execute(companyId: string, notificationDto: CreateNotificationDto): Promise<NotificationEntity>;
}

export interface IGetUserNotificationsUseCase {
  execute(userId: string, companyId: string): Promise<{ notifications: NotificationEntity[]; unreadCount: number }>;
}

export interface IMarkNotificationReadUseCase {
  execute(id: string, companyId: string): Promise<NotificationEntity>;
}
