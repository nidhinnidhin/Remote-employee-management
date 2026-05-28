import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationSchema,
} from './infrastructure/database/mongoose/schemas/notification.schema';
import { MongoNotificationRepository } from './infrastructure/database/repositories/mongo-notification.repository';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.usecase';
import { GetUserNotificationsUseCase } from './application/use-cases/get-user-notifications.usecase';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.usecase';
import { NotificationController } from './presentation/controllers/notification.controller';
import { NotificationGateway } from './presentation/gateways/notification.gateway';
import { AuthModule } from '../auth/presentation/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationGateway,

    {
      provide: 'INotificationRepository',
      useClass: MongoNotificationRepository,
    },

    {
      provide: 'ICreateNotificationUseCase',
      useClass: CreateNotificationUseCase,
    },
    GetUserNotificationsUseCase,
    MarkNotificationReadUseCase,
  ],
  exports: ['ICreateNotificationUseCase', NotificationGateway],
})
export class NotificationModule {}
