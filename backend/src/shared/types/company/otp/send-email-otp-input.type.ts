import { OtpPurpose } from "src/shared/enums/reset-password/otp-purpose.enum";

export interface SendEmailOtpInput {
  userId: string;
  email: string;
  purpose?: OtpPurpose;
}