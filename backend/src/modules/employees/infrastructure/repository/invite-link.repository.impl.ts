import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IInviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { InviteLinkDocument } from '../schema/invite-link.schema';

import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class InviteLinkRepositoryImpl
  extends BaseRepository<InviteLinkDocument, InviteLinkToken>
  implements IInviteLinkRepository {
  constructor(
    @InjectModel(InviteLinkDocument.name)
    private readonly _inviteLinkModel: Model<InviteLinkDocument>,
  ) {
    super(_inviteLinkModel);
  }

  // Override create to handle entity to document mapping if needed, 
  // or use base save(data: Partial<InviteLinkDocument>)
  async create(token: InviteLinkToken): Promise<void> {
    await super.save({
      token: token.token,
      employeeId: new Types.ObjectId(token.employeeId),
      expiresAt: token.expiresAt,
      used: token.used,
    } as any);
  }

  async findByToken(token: string): Promise<InviteLinkToken | null> {
    return this.findOne({ token });
  }

  async markAsUsed(token: string): Promise<void> {
    await this.updateMany({ token }, { $set: { used: true } });
  }

  async markAllAsUsedByEmployeeId(employeeId: string): Promise<void> {
    await this.updateMany(
      { employeeId: new Types.ObjectId(employeeId) },
      { $set: { used: true } },
    );
  }

  protected toEntity(doc: InviteLinkDocument): InviteLinkToken {
    return new InviteLinkToken(
      doc.token,
      doc.employeeId.toString(),
      doc.expiresAt,
      doc.used,
    );
  }
}
