import { Injectable, Inject } from '@nestjs/common';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { IGetUserNotificationsUseCase } from '../interfaces/notification-use-cases.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@Injectable()
export class GetUserNotificationsUseCase implements IGetUserNotificationsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
  ): Promise<{ notifications: NotificationEntity[]; unreadCount: number }> {
    const notifications = await this._notificationRepository.findByUser(userId, companyId);
    const unreadCount = await this._notificationRepository.getUnreadCount(userId, companyId);
    return { notifications, unreadCount };
  }
}
