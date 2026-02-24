// import { EmailOtpEntity } from '../entities/email-otp.entity';

// export interface EmailOtpRepository {
//   create(otp: EmailOtpEntity): Promise<void>;
//   findLatestByEmail(email: string): Promise<EmailOtpEntity | null>;
//   markAsVerified(id: string): Promise<void>;
// }

import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { EmailOtpEntity } from '../entities/email-otp.entity';

export interface EmailOtpRepository {
  create(otp: EmailOtpEntity): Promise<void>;

  findLatestByEmail(email: string): Promise<EmailOtpEntity | null>;

  findLatestByUserAndEmail(
  userId: string,
  email: string,
  purpose?: OtpPurpose,
): Promise<EmailOtpEntity | null>;

  markVerified(id: string): Promise<void>;
}