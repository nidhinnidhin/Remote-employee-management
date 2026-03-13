import { InviteLinkToken } from '../entities/invite-link-token.entity';

export interface IInviteLinkRepository {
  create(token: InviteLinkToken): Promise<void>;
  findByToken(token: string): Promise<InviteLinkToken | null>;
  markAsUsed(token: string): Promise<void>;
  markAllAsUsedByEmployeeId(employeeId: string): Promise<void>;
  deleteExpiredTokens(): Promise<number>;
}