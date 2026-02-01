import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InviteLinkRepository } from '../../domain/repositories/invite-link.repository';
import { InviteLinkToken } from '../../domain/entities/invite-link-token.entity';
import { InviteLinkDocument } from '../schema/invite-link.schema';

export class InviteLinkRepositoryImpl implements InviteLinkRepository {
  constructor(
    @InjectModel(InviteLinkDocument.name)
    private readonly model: Model<InviteLinkDocument>,
  ) {}

  async create(token: InviteLinkToken): Promise<void> {
    await this.model.create({
      token: token.token,
      employeeId: token.employeeId,
      expiresAt: token.expiresAt,
      used: token.used,
    });
  }

  async findByToken(token: string): Promise<InviteLinkToken | null> {
    const doc = await this.model.findOne({ token });
    if (!doc) return null;

    return new InviteLinkToken(
      doc.token,
      doc.employeeId.toString(),
      doc.expiresAt,
      doc.used,
    );
  }

  async markAsUsed(token: string): Promise<void> {
    await this.model.updateOne(
      { token },
      { $set: { used: true } },
    );
  }
}
