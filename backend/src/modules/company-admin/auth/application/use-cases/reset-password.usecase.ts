import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';
import { ResetPasswordInput } from 'src/shared/types/company/reset-password/reset-password-input.type';
import { ResetPasswordResponse } from 'src/shared/types/company/reset-password/reset-password-response.type';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('EmailOtpRepository')
    private readonly otpRepository: EmailOtpRepository,
  ) {}

  async execute(input: ResetPasswordInput): Promise<ResetPasswordResponse> {
    const record = await this.otpRepository.findLatestByEmail(
      input.email.toLowerCase(),
    );

    if (!record || !record.verified) {
      throw new BadRequestException(OTP_MESSAGES.OTP_NOT_VERIFIED);
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);

    await this.userRepository.updatePasswordByEmail(
      input.email.toLowerCase(),
      passwordHash,
    );
    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS };
  }
}
