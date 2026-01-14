import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailOtpEntity } from '../../../domain/entities/email-otp.entity';
import type { EmailOtpRepository } from '../../../domain/repositories/email-otp.repository';

@Injectable()
export class MongoEmailOtpRepository implements EmailOtpRepository {
  constructor(
    @InjectModel('EmailOtp')
    private readonly emailOtpModel: Model<any>,
  ) {}

  async create(otp: EmailOtpEntity): Promise<void> {
    await this.emailOtpModel.create({
      userId: otp.userId,
      email: otp.email,
      otpHash: otp.otpHash,
      expiresAt: otp.expiresAt,
      verified: otp.verified,
    });
  }

  async findLatestByEmail(email: string): Promise<EmailOtpEntity | null> {
    const doc = await this.emailOtpModel
      .findOne({ email, verified: false })
      .sort({ createdAt: -1 });

    return doc
      ? new EmailOtpEntity(
          doc._id.toString(),
          doc.userId,
          doc.email,
          doc.otpHash,
          doc.expiresAt,
          doc.verified,
          doc.createdAt,
        )
      : null;
  }

  async markAsVerified(id: string): Promise<void> {
    await this.emailOtpModel.updateOne({ _id: id }, { verified: true });
  }
}
