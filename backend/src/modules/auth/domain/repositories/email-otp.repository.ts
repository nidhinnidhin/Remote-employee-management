import { EmailOtpEntity } from '../entities/email-otp.entity';

export interface EmailOtpRepository {
  create(otp: EmailOtpEntity): Promise<void>;
  findLatestByEmail(email: string): Promise<EmailOtpEntity | null>;
  markAsVerified(id: string): Promise<void>;
}
