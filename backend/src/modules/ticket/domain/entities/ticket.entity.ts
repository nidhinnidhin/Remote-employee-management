import { TicketPriority } from 'src/shared/enums/ticket/ticket-priority.enum';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

export class TicketEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly raisedBy: string,
    public readonly title: string,
    public readonly description: string,
    public readonly priority: TicketPriority,
    public status: TicketStatus,
    public statusNote?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly companyName?: string,
    public readonly userEmail?: string,
  ) {}
}