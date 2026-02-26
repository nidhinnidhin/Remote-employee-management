import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SendEmailOtpUseCase } from '../otp/send-email-otp.usecase';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';

@Injectable()
export class RequestEmailChangeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,
    private readonly _sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) {}

  async execute(userId: string, newEmail: string) {
    const emailLower = newEmail.toLowerCase();

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const existing = await this._userRepository.findByEmail(emailLower);
    if (existing) {
      throw new BadRequestException(AUTH_MESSAGES.COMPANY_ALREADY_EXIST);
    }

    await this._sendEmailOtpUseCase.execute({
      userId,
      email: user.email,
      purpose: OtpPurpose.EMAIL_CHANGE,
      newEmail: emailLower, 
    });

    return {
      message: OTP_MESSAGES.OTP_SENT,
    };
  }
}
