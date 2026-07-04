import {
  IsString,
  IsNotEmpty,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TicketPriority } from 'src/shared/enums/ticket/ticket-priority.enum';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty({ message: 'Ticket title must not be empty.' })
  @MinLength(5, { message: 'Ticket title must be at least 5 characters long.' })
  @MaxLength(100, { message: 'Ticket title must not exceed 100 characters.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Ticket description must not be empty.' })
  @MinLength(20, {
    message: 'Ticket description must be at least 20 characters long to provide sufficient context.',
  })
  @MaxLength(2000, {
    message: 'Ticket description must not exceed 2000 characters.',
  })
  description: string;

  @IsEnum(TicketPriority, {
    message: `Priority must be one of: ${Object.values(TicketPriority).join(', ')}.`,
  })
  priority: TicketPriority;
}
