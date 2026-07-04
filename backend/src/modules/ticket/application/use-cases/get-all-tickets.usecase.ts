import { Injectable, Inject } from '@nestjs/common';
import type { ITicketRepository, TicketFilter } from '../../domain/repositories/iticket.repository';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import type { IGetAllTicketsUseCase } from '../interfaces/ticket-use-case.interface';

@Injectable()
export class GetAllTicketsUseCase implements IGetAllTicketsUseCase {
  constructor(
    @Inject('ITicketRepository')
    private readonly _ticketRepository: ITicketRepository,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }> {
    return this._ticketRepository.findAll(page, limit, filter);
  }
}
