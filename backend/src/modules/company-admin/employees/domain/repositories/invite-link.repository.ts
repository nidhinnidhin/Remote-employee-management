import {InviteLinkToken } from '../entities/invite-link-token.entity';

export interface InviteLinkRepository {
  create(token: InviteLinkToken): Promise<void>;
  findByToken(token: string): Promise<InviteLinkToken | null>;
  markAsUsed(token: string): Promise<void>;
}