import { EmailOtpEntity } from '../entities/email-otp.entity';

export interface EmailOtpRepository {
  create(otp: EmailOtpEntity): Promise<void>;
}
