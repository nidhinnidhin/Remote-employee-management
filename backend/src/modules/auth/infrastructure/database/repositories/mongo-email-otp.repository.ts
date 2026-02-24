import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailOtpEntity } from '../../../domain/entities/email-otp.entity';
import type { EmailOtpRepository } from '../../../domain/repositories/email-otp.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';

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
      newEmail: otp.newEmail, 
      purpose: otp.purpose,
    });
  }

  async findLatestByEmail(email: string): Promise<EmailOtpEntity | null> {
    const doc = await this.emailOtpModel
      .findOne({ email, verified: false })
      .sort({ createdAt: -1 });

    if (!doc) return null;

    return new EmailOtpEntity(
      doc._id.toString(),
      doc.userId,
      doc.email,
      doc.otpHash,
      doc.expiresAt,
      doc.verified,
      doc.createdAt,
      doc.newEmail,
      doc.purpose,
    );
  }

  async findLatestByUserAndEmail(
  userId: string,
  email: string,
  purpose?: OtpPurpose,
): Promise<EmailOtpEntity | null> {
  const query: any = {
    userId,
    email,
    verified: false,
  };

  if (purpose) {
    query.purpose = purpose;
  }

  const doc = await this.emailOtpModel
    .findOne(query)
    .sort({ createdAt: -1 });

  if (!doc) return null;

  return new EmailOtpEntity(
    doc._id.toString(),
    doc.userId,
    doc.email,
    doc.otpHash,
    doc.expiresAt,
    doc.verified,
    doc.createdAt,
    doc.newEmail,
    doc.purpose,
  );
}

  async markVerified(id: string): Promise<void> {
    await this.emailOtpModel.updateOne(
      { _id: id },
      { verified: true },
    );
  }
}