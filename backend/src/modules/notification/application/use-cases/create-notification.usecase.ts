import { Injectable, Inject } from '@nestjs/common';
import type { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { ICreateNotificationUseCase } from '../interfaces/notification-use-cases.interface';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationEntity } from '../../domain/entities/notification.entity';
// Assuming NotificationGateway will be created later to emit events
import { NotificationGateway } from '../../presentation/gateways/notification.gateway';

@Injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
    // We will inject the gateway to emit real-time events
    private readonly _notificationGateway: NotificationGateway,
  ) {}

  async execute(
    companyId: string,
    notificationDto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = await this._notificationRepository.create({
      ...notificationDto,
      companyId,
    });

    // Emit real-time notification
    this._notificationGateway.sendNotificationToUser(
      notificationDto.recipientId,
      notification
    );

    return notification;
  }
}
