import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { IInviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { InviteLinkDocument } from '../schema/invite-link.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import {
  InviteLinkMapper,
  LeanInviteLinkDocument,
} from '../../application/mappers/invite-link.mapper';

@Injectable()
export class InviteLinkRepositoryImpl
  extends BaseRepository<InviteLinkDocument, InviteLinkToken>
  implements IInviteLinkRepository
{
  constructor(
    @InjectModel(InviteLinkDocument.name)
    private readonly _inviteLinkModel: Model<InviteLinkDocument>,
  ) {
    super(_inviteLinkModel);
  }

  protected toEntity(
    doc: InviteLinkDocument | LeanInviteLinkDocument,
  ): InviteLinkToken {
    return InviteLinkMapper.toDomain(doc);
  }

  async create(token: InviteLinkToken): Promise<void> {
    const persistenceData = InviteLinkMapper.toPersistence(token);
    await this.save(persistenceData);
  }

  async findByToken(token: string): Promise<InviteLinkToken | null> {
    return this.findOne({ token });
  }

  async markAsUsed(token: string): Promise<void> {
    await this.updateMany({ token }, {
      $set: { used: true },
    } as UpdateQuery<InviteLinkDocument>);
  }

  async markAllAsUsedByEmployeeId(employeeId: string): Promise<void> {
    await this.updateMany({ employeeId: new Types.ObjectId(employeeId) }, {
      $set: { used: true },
    } as UpdateQuery<InviteLinkDocument>);
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.model.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return result.deletedCount;
  }
}
