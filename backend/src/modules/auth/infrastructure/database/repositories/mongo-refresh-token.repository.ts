import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenDocument } from '../mongoose/schemas/refresh-token.schema';

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenDocument.name)
    private readonly model: Model<RefreshTokenDocument>,
  ) { }

  async create(token: RefreshToken): Promise<RefreshToken> {
    const created = await this.model.create({
      _id: token.id,
      userId: token.userId,
      companyId: token.companyId,
      token: token.token,
      expiresAt: token.expiresAt,
      revoked: token.revoked,
      createdAt: token.createdAt,
    });
    return this.toEntity(created);
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const found = await this.model.findOne({ token });
    return found ? this.toEntity(found) : null;
  }

  async revoke(tokenId: string): Promise<void> {
    await this.model.updateOne({ _id: tokenId }, { revoked: true });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.model.updateMany({ userId }, { revoked: true });
  }

  private toEntity(doc: RefreshTokenDocument): RefreshToken {
    return new RefreshToken(
      doc._id.toString(),
      doc.userId,
      doc.companyId,
      doc.token,
      doc.expiresAt,
      doc.revoked,
      doc.createdAt,
    );
  }
}
