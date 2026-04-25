import { Types, FlattenMaps } from 'mongoose';
import { EmailOtpEntity } from '../../domain/entities/email-otp.entity';
import { EmailOtpDocument } from '../../infrastructure/database/mongoose/schemas/email-otp.schema';

// Strict type for leaned documents
export type LeanEmailOtpDocument = FlattenMaps<EmailOtpDocument> & { _id: Types.ObjectId };

export class EmailOtpMapper {

  static toDomain(doc: EmailOtpDocument | LeanEmailOtpDocument): EmailOtpEntity {
    return new EmailOtpEntity(
      doc._id?.toString() || (doc as any).id,
      doc.userId,
      doc.email,
      doc.otpHash,
      doc.expiresAt || new Date(),
      !!doc.verified,
      doc.createdAt || new Date(),
      doc.newEmail,
      doc.purpose,
    );
  }

  static toPersistence(entity: EmailOtpEntity): Partial<EmailOtpDocument> {
    return {
      userId: entity.userId,
      email: entity.email,
      otpHash: entity.otpHash,
      expiresAt: entity.expiresAt,
      verified: entity.verified,
      newEmail: entity.newEmail,
      purpose: entity.purpose,
    } as Partial<EmailOtpDocument>;
  }
}