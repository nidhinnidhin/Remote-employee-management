import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { EmailOtpEntity } from '../../../domain/entities/email-otp.entity';
import { IEmailOtpRepository } from '../../../domain/repositories/iemail-otp.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { EmailOtpDocument } from '../mongoose/schemas/email-otp.schema';
import {
  EmailOtpMapper,
  LeanEmailOtpDocument,
} from 'src/modules/auth/application/mappers/email-otp.mapper';

@Injectable()
export class MongoEmailOtpRepository
  extends BaseRepository<EmailOtpDocument, EmailOtpEntity>
  implements IEmailOtpRepository
{
  constructor(
    @InjectModel('EmailOtp')
    private readonly _emailOtpModel: Model<EmailOtpDocument>,
  ) {
    super(_emailOtpModel);
  }

  protected toEntity(
    otp: EmailOtpDocument | LeanEmailOtpDocument,
  ): EmailOtpEntity {
    return EmailOtpMapper.toDomain(otp);
  }

  async create(otp: EmailOtpEntity): Promise<void> {
    const persistenceData = EmailOtpMapper.toPersistence(otp);
    await this.save(persistenceData);
  }

  async findLatestByEmail(email: string): Promise<EmailOtpEntity | null> {
    const doc = await this.model
      .findOne({ email, verified: false })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!doc) return null;
    return this.toEntity(doc as unknown as LeanEmailOtpDocument);
  }

  async findLatestByUserAndEmail(
    userId: string,
    email: string,
    purpose?: OtpPurpose,
  ): Promise<EmailOtpEntity | null> {
    const query: FilterQuery<EmailOtpDocument> = {
      userId,
      email,
      verified: false,
    };
    if (purpose) query.purpose = purpose;

    const doc = await this.model
      .findOne(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!doc) return null;
    return this.toEntity(doc as unknown as LeanEmailOtpDocument);
  }

  async markVerified(id: string): Promise<void> {
    await this.updateById(id, { verified: true });
  }
}
