import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GetUserNotificationsUseCase } from '../../application/use-cases/get-user-notifications.usecase';
import { MarkNotificationReadUseCase } from '../../application/use-cases/mark-notification-read.usecase';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly _getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly _markNotificationReadUseCase: MarkNotificationReadUseCase,
  ) {}

  @Get()
  async getUserNotifications(@Req() req: any) {
    return this._getUserNotificationsUseCase.execute(
      req.user.userId,
      req.user.companyId,
    );
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this._markNotificationReadUseCase.execute(id, req.user.companyId);
  }
}
