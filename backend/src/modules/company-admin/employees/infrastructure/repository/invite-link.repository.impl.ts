import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { InviteLinkDocument } from '../schema/invite-link.schema';

@Injectable()
export class InviteLinkRepositoryImpl implements InviteLinkRepository {
  constructor(
    @InjectModel(InviteLinkDocument.name)
    private readonly _inviteLinkModel: Model<InviteLinkDocument>,
  ) {}

  async create(token: InviteLinkToken): Promise<void> {
    await this._inviteLinkModel.create({
      token: token.token,
      employeeId: token.employeeId,
      expiresAt: token.expiresAt,
      used: token.used,
    });
  }

  async findByToken(token: string): Promise<InviteLinkToken | null> {
    const doc = await this._inviteLinkModel
      .findOne({ token })
      .lean<InviteLinkDocument>();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async markAsUsed(token: string): Promise<void> {
    await this._inviteLinkModel.updateOne({ token }, { $set: { used: true } });
  }

  async markAllAsUsedByEmployeeId(employeeId: string): Promise<void> {
    await this._inviteLinkModel.updateMany(
      { employeeId: new Types.ObjectId(employeeId) },
      { $set: { used: true } },
    );
  }

  private toEntity(doc: InviteLinkDocument): InviteLinkToken {
    return new InviteLinkToken(
      doc.token,
      doc.employeeId.toString(),
      doc.expiresAt,
      doc.used,
    );
  }
}
