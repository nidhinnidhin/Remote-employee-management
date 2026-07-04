import { Injectable, Inject } from '@nestjs/common';
import type { ITicketRepository } from '../../domain/repositories/iticket.repository';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';
import type { ICreateTicketUseCase } from '../interfaces/ticket-use-case.interface';

@Injectable()
export class CreateTicketUseCase implements ICreateTicketUseCase {
  constructor(
    @Inject('ITicketRepository')
    private readonly _ticketRepository: ITicketRepository,
  ) {}

  async execute(
    companyId: string,
    raisedBy: string,
    dto: CreateTicketDto,
  ): Promise<TicketEntity> {
    const ticket = new TicketEntity(
      '',
      companyId,
      raisedBy,
      dto.title.trim(),
      dto.description.trim(),
      dto.priority,
      TicketStatus.OPEN, // Always starts as OPEN
    );

    return this._ticketRepository.create(ticket);
  }
}
