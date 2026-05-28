import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { IMarkNotificationReadUseCase } from '../interfaces/notification-use-cases.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@Injectable()
export class MarkNotificationReadUseCase implements IMarkNotificationReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(
    id: string,
    companyId: string,
  ): Promise<NotificationEntity> {
    const notification = await this._notificationRepository.markAsRead(id, companyId);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }
}
