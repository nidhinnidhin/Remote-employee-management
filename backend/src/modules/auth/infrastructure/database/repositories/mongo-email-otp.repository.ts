import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { EmailOtpEntity } from '../../../domain/entities/email-otp.entity';
import { IEmailOtpRepository } from '../../../domain/repositories/iemail-otp.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { EmailOtpDocument } from '../mongoose/schemas/email-otp.schema';

@Injectable()
export class MongoEmailOtpRepository 
  extends BaseRepository<EmailOtpDocument, EmailOtpEntity> 
  implements IEmailOtpRepository 
{
  constructor(
    @InjectModel('EmailOtp')
    private readonly _emailOtpModel: Model<EmailOtpDocument>,
  ) {
    // Pass the model up to the BaseRepository
    super(_emailOtpModel); 
  }

  // Must be protected to match the abstract BaseRepository
  protected toEntity(otp: EmailOtpDocument): EmailOtpEntity {
    return new EmailOtpEntity(
      (otp._id as import('mongoose').Types.ObjectId).toString(),
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

  async create(otp: EmailOtpEntity): Promise<void> {
    // Utilize the generic save() method from the BaseRepository
    await this.save({
      userId: otp.userId,
      email: otp.email,
      otpHash: otp.otpHash,
      expiresAt: otp.expiresAt,
      verified: otp.verified,
      newEmail: otp.newEmail,
      purpose: otp.purpose,
    } as Partial<EmailOtpDocument>);
  }

  async findLatestByEmail(email: string): Promise<EmailOtpEntity | null> {
    // We use this.model directly because the base findOne doesn't support sorting
    const doc = await this.model
      .findOne({ email, verified: false })
      .sort({ createdAt: -1 })
      .lean()
      .exec() as EmailOtpDocument | null;
      
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findLatestByUserAndEmail(
    userId: string,
    email: string,
    purpose?: OtpPurpose,
  ): Promise<EmailOtpEntity | null> {
    const query: FilterQuery<EmailOtpDocument> = { userId, email, verified: false };
    if (purpose) query.purpose = purpose;
    
    // We use this.model directly because the base findOne doesn't support sorting
    const doc = await this.model
      .findOne(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec() as EmailOtpDocument | null;
      
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async markVerified(id: string): Promise<void> {
    // Utilize the generic updateById() method from the BaseRepository
    await this.updateById(id, { verified: true });
  }
}