// src/notifications/presentation/controllers/notification.controller.ts
import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
  Inject, // <-- Make sure Inject is imported from @nestjs/common
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import type {
  IGetUserNotificationsUseCase,
  IMarkAllNotificationsReadUseCase,
  IMarkNotificationReadUseCase,
} from '../../application/interfaces/notification-use-cases.interface';
import type { AuthenticatedRequest } from 'src/shared/types/express/authenticated-request.interface';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    @Inject('IGetUserNotificationsUseCase')
    private readonly _getUserNotificationsUseCase: IGetUserNotificationsUseCase,

    @Inject('IMarkNotificationReadUseCase')
    private readonly _markNotificationReadUseCase: IMarkNotificationReadUseCase,

    @Inject('IMarkAllNotificationsReadUseCase')
    private readonly _markAllNotificationsReadUseCase: IMarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  async getUserNotifications(@Req() req: AuthenticatedRequest) {
    return this._getUserNotificationsUseCase.execute(
      req.user.userId,
      req.user.companyId,
    );
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: AuthenticatedRequest) {
    return this._markAllNotificationsReadUseCase.execute(
      req.user.userId,
      req.user.companyId,
    );
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this._markNotificationReadUseCase.execute(id, req.user.companyId);
  }
}
