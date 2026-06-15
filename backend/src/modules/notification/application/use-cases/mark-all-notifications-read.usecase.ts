import { Inject, Injectable } from '@nestjs/common';
import { IMarkAllNotificationsReadUseCase } from '../interfaces/notification-use-cases.interface';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class MarkAllNotificationsReadUseCase implements IMarkAllNotificationsReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
  ): Promise<{ success: boolean }> {
    const result = await this._notificationRepository.markAllAsRead(
      userId,
      companyId,
    );
    return { success: result };
  }
}
