import { Injectable, Inject } from '@nestjs/common';
import type { ITicketRepository, TicketFilter } from '../../domain/repositories/iticket.repository';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import type { IGetMyTicketsUseCase } from '../interfaces/ticket-use-case.interface';

@Injectable()
export class GetMyTicketsUseCase implements IGetMyTicketsUseCase {
  constructor(
    @Inject('ITicketRepository')
    private readonly _ticketRepository: ITicketRepository,
  ) {}

  async execute(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }> {
    return this._ticketRepository.findByCompanyId(companyId, page, limit, filter);
  }
}
