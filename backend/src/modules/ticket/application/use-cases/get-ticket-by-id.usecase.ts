import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import type { ITicketRepository } from '../../domain/repositories/iticket.repository';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import type { IGetTicketByIdUseCase } from '../interfaces/ticket-use-case.interface';

@Injectable()
export class GetTicketByIdUseCase implements IGetTicketByIdUseCase {
  constructor(
    @Inject('ITicketRepository')
    private readonly _ticketRepository: ITicketRepository,
  ) {}

  async execute(id: string): Promise<TicketEntity> {
    const ticket = await this._ticketRepository.findById(id);

    if (!ticket) {
      throw new NotFoundException(`Ticket with id "${id}" was not found.`);
    }

    return ticket;
  }
}
