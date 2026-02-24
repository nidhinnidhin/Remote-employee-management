import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SendEmailOtpUseCase } from '../otp/send-email-otp.usecase';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';

@Injectable()
export class RequestEmailChangeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) {}

  async execute(userId: string, newEmail: string) {
    const emailLower = newEmail.toLowerCase();

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existing = await this.userRepository.findByEmail(emailLower);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    await this.sendEmailOtpUseCase.execute({
      userId,
      email: user.email, // old email
      purpose: OtpPurpose.EMAIL_CHANGE,
      newEmail: emailLower, // MUST PASS THIS
    });

    return {
      message: `OTP sent to your registered email ${user.email}`,
    };
  }
}
