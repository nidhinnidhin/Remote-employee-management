import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus, {
    message: `Status must be one of: ${Object.values(TicketStatus).join(', ')}.`,
  })
  status: TicketStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Status note must not exceed 500 characters.',
  })
  statusNote?: string;
}
