import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NotificationType } from '../../domain/entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;
}
