import { TicketEntity } from '../entities/ticket.entity';
import { TicketPriority } from 'src/shared/enums/ticket/ticket-priority.enum';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

export interface TicketFilter {
  search?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
}

export interface ITicketRepository {
  create(ticket: TicketEntity): Promise<TicketEntity>;
  findById(id: string): Promise<TicketEntity | null>;
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }>;
  findAll(
    page: number,
    limit: number,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }>;
  updateStatus(
    id: string,
    status: TicketStatus,
    statusNote?: string,
  ): Promise<TicketEntity | null>;
}
