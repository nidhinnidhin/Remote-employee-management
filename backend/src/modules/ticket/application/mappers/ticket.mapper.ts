import { TicketEntity } from '../../domain/entities/ticket.entity';
import { TicketPriority } from 'src/shared/enums/ticket/ticket-priority.enum';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

// Strict definitions for populated document properties
export interface PopulatedCompany {
  _id: { toString(): string } | string;
  name: string;
}

export interface PopulatedUser {
  _id: { toString(): string } | string;
  email: string;
}

// Represents a lean Mongoose document supporting both standard and populated shapes cleanly
export interface LeanTicketDocument {
  _id: { toString(): string } | string;
  companyId: { toString(): string } | string | PopulatedCompany;
  raisedBy: { toString(): string } | string | PopulatedUser;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  statusNote?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  // Extended virtual keys attached inside the repository layer mappings
  companyName?: string;
  userEmail?: string;
}

export class TicketMapper {
  static toDomain(doc: LeanTicketDocument): TicketEntity {
    // Safely resolve the string IDs regardless of whether the document is populated
    const companyIdStr = typeof doc.companyId === 'object' && doc.companyId !== null && 'name' in doc.companyId
      ? (doc.companyId as PopulatedCompany)._id.toString()
      : doc.companyId.toString();

    const raisedByStr = typeof doc.raisedBy === 'object' && doc.raisedBy !== null && 'email' in doc.raisedBy
      ? (doc.raisedBy as PopulatedUser)._id.toString()
      : doc.raisedBy.toString();

    // Safely extract names or provide default fallback string tags
    const resolvedCompanyName = doc.companyName 
      ? doc.companyName 
      : (typeof doc.companyId === 'object' && doc.companyId !== null && 'name' in doc.companyId 
          ? (doc.companyId as PopulatedCompany).name 
          : 'Unknown Organization');

    const resolvedUserEmail = doc.userEmail 
      ? doc.userEmail 
      : (typeof doc.raisedBy === 'object' && doc.raisedBy !== null && 'email' in doc.raisedBy 
          ? (doc.raisedBy as PopulatedUser).email 
          : 'System User');

    return new TicketEntity(
      doc._id.toString(),
      companyIdStr,
      raisedByStr,
      doc.title,
      doc.description,
      doc.priority,
      doc.status,
      doc.statusNote ?? null,
      doc.createdAt,
      doc.updatedAt,
      resolvedCompanyName,  // ◄── Pass companyName to your Domain Entity Constructor
      resolvedUserEmail    // ◄── Pass userEmail to your Domain Entity Constructor
    );
  }
}