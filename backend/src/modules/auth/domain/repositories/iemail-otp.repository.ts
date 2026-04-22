import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { EmailOtpEntity } from '../entities/email-otp.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; // Adjust path
import { EmailOtpDocument } from '../../infrastructure/database/mongoose/schemas/email-otp.schema'; // Adjust path

export interface IEmailOtpRepository extends IBaseRepository<EmailOtpDocument, EmailOtpEntity> {
  create(otp: EmailOtpEntity): Promise<void>;
  findLatestByEmail(email: string): Promise<EmailOtpEntity | null>;
  findLatestByUserAndEmail(
    userId: string,
    email: string,
    purpose?: OtpPurpose,
  ): Promise<EmailOtpEntity | null>;
  markVerified(id: string): Promise<void>;
}