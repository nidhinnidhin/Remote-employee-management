import { ResendOtpDto } from 'src/modules/auth/presentation/dto/resend-otp.dto';
import { VerifyEmailOtpDto } from 'src/modules/auth/presentation/dto/verify-email-otp.dto';
import { SendEmailOtpInput } from 'src/shared/types/company/otp/send-email-otp-input.type';

export interface IOtpRepository {
  sendEmailOtp(input: SendEmailOtpInput): Promise<void>;

  verifyEmailOtp(input: VerifyEmailOtpDto): Promise<any>;

  resendEmailOtp(input: ResendOtpDto): Promise<void>;
}