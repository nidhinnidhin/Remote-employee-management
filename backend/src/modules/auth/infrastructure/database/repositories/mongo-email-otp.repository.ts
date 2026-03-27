import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailOtpEntity } from '../../../domain/entities/email-otp.entity';
import type { IEmailOtpRepository } from '../../../domain/repositories/iemail-otp.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';

@Injectable()
export class MongoEmailOtpRepository implements IEmailOtpRepository {
  constructor(
    @InjectModel('EmailOtp')
    private readonly _emailOtpModel: Model<any>,
  ) {}

  async create(otp: EmailOtpEntity): Promise<void> {
    await this._emailOtpModel.create({
      userId: otp.userId,
      email: otp.email,
      otpHash: otp.otpHash,
      expiresAt: otp.expiresAt,
      verified: otp.verified,
      newEmail: otp.newEmail,
      purpose: otp.purpose,
    });
  }

  async findLatestByEmail(email: string): Promise<EmailOtpEntity | null> {
    const doc = await this._emailOtpModel
      .findOne({ email, verified: false })
      .sort({ createdAt: -1 });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findLatestByUserAndEmail(
    userId: string,
    email: string,
    purpose?: OtpPurpose,
  ): Promise<EmailOtpEntity | null> {
    const query: any = { userId, email, verified: false };
    if (purpose) query.purpose = purpose;
    const doc = await this._emailOtpModel
      .findOne(query)
      .sort({ createdAt: -1 });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async markVerified(id: string): Promise<void> {
    await this._emailOtpModel.updateOne({ _id: id }, { verified: true });
  }

  private toEntity(otp: any): EmailOtpEntity {
    return new EmailOtpEntity(
      otp._id.toString(),
      otp.userId,
      otp.email,
      otp.otpHash,
      otp.expiresAt,
      otp.verified,
      otp.createdAt,
      otp.newEmail,
      otp.purpose,
    );
  }
}
