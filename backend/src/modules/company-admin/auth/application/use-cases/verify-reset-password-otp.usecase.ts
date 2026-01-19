import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';

@Injectable()
export class VerifyResetPasswordOtpUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly otpRepository: EmailOtpRepository,
  ) {}

  async execute(email: string, otp: string) {
    const record =
      await this.otpRepository.findLatestByEmail(
        email.toLowerCase(),
      );

    if (!record) {
      throw new BadRequestException('OTP not found');
    }

    if (record.verified) {
      throw new BadRequestException('OTP already used');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const isValidOtp = await bcrypt.compare(
      otp,
      record.otpHash,
    );

    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpRepository.markAsVerified(record.id);

    return { message: 'OTP verified successfully' };
  }
}
