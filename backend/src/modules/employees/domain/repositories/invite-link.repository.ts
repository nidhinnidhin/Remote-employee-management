import { InviteLinkToken } from '../entities/invite-link-token.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; // Adjust path
import { InviteLinkDocument } from '../../infrastructure/schema/invite-link.schema'; // Adjust path

export interface IInviteLinkRepository extends IBaseRepository<InviteLinkDocument, InviteLinkToken> {
  create(token: InviteLinkToken): Promise<void>;
  findByToken(token: string): Promise<InviteLinkToken | null>;
  markAsUsed(token: string): Promise<void>;
  markAllAsUsedByEmployeeId(employeeId: string): Promise<void>;
  deleteExpiredTokens(): Promise<number>;
}