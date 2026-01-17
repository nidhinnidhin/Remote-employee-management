import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class VerifyEmailOtpUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly emailOtpRepository: EmailOtpRepository,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, otp: string): Promise<string> {
    const latestOtp = await this.emailOtpRepository.findLatestByEmail(email);

    if (!latestOtp) {
      throw new UnauthorizedException('OTP not found');
    }

    if (latestOtp.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    const isValid = await bcrypt.compare(otp, latestOtp.otpHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.emailOtpRepository.markAsVerified(latestOtp.id);
    await this.userRepository.updateStatusByEmail(email, 'ACTIVE');

    return latestOtp.userId;
  }
}
