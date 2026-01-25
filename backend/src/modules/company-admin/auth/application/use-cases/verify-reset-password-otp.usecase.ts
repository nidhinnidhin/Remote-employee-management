import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';
import { VerifyResetPasswordOtpInput } from 'src/shared/types/company-auth/otp/verify-reset-password-otp-input.type';
import { VerifyResetPasswordOtpResponse } from 'src/shared/types/company-auth/otp/verify-reset-password-otp-response.type';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';

@Injectable()
export class VerifyResetPasswordOtpUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly otpRepository: EmailOtpRepository,
  ) {}

  async execute(
    input: VerifyResetPasswordOtpInput,
  ): Promise<VerifyResetPasswordOtpResponse> {
    const record = await this.otpRepository.findLatestByEmail(
      input.email.toLowerCase(),
    );

    if (!record) {
      throw new BadRequestException(OTP_MESSAGES.OTP_NOT_FOUND);
    }

    if (record.verified) {
      throw new BadRequestException(OTP_MESSAGES.OTP_ALREADY_USED);
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    const isValidOtp = await bcrypt.compare(input.otp, record.otpHash);

    if (!isValidOtp) {
      throw new BadRequestException(OTP_MESSAGES.OTP_INVALID);
    }

    await this.otpRepository.markAsVerified(record.id);

    return { message: OTP_MESSAGES.OTP_NOT_VERIFIED };
  }
}
