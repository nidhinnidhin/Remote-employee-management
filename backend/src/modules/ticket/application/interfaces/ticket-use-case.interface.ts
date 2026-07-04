import { TicketEntity } from '../../domain/entities/ticket.entity';
import { CreateTicketDto } from '../dto/create-ticket.dto';
import { TicketFilter } from '../../domain/repositories/iticket.repository';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';
import { UpdateTicketStatusDto } from '../dto/update-ticket-status.dto';

export interface ICreateTicketUseCase {
  execute(
    companyId: string,
    raisedBy: string,
    dto: CreateTicketDto,
  ): Promise<TicketEntity>;
}

export interface IGetMyTicketsUseCase {
  execute(
    companyId: string,
    page?: number,
    limit?: number,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }>;
}

export interface IGetAllTicketsUseCase {
  execute(
    page?: number,
    limit?: number,
    filter?: TicketFilter,
  ): Promise<{ data: TicketEntity[]; total: number }>;
}

export interface IGetTicketByIdUseCase {
  execute(id: string): Promise<TicketEntity>;
}

export interface IUpdateTicketStatusUseCase {
  execute(
    id: string,
    dto: UpdateTicketStatusDto,
  ): Promise<TicketEntity>;
}
