import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import type { ITicketRepository } from '../../domain/repositories/iticket.repository';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import { UpdateTicketStatusDto } from '../dto/update-ticket-status.dto';
import type { IUpdateTicketStatusUseCase } from '../interfaces/ticket-use-case.interface';

@Injectable()
export class UpdateTicketStatusUseCase implements IUpdateTicketStatusUseCase {
  constructor(
    @Inject('ITicketRepository')
    private readonly _ticketRepository: ITicketRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateTicketStatusDto,
  ): Promise<TicketEntity> {
    // Verify ticket exists before attempting update
    const existing = await this._ticketRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Ticket with id "${id}" was not found.`);
    }

    const updated = await this._ticketRepository.updateStatus(
      id,
      dto.status,
      dto.statusNote,
    );

    if (!updated) {
      throw new NotFoundException(`Ticket with id "${id}" could not be updated.`);
    }

    return updated;
  }
}
