import {
  Injectable,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('EmailOtpRepository')
    private readonly otpRepository: EmailOtpRepository,
  ) {}

  async execute(email: string, newPassword: string) {
    const record =
      await this.otpRepository.findLatestByEmail(
        email.toLowerCase(),
      );

    if (!record || !record.verified) {
      throw new BadRequestException(
        'OTP not verified',
      );
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const passwordHash = await bcrypt.hash(
      newPassword,
      10,
    );

    await this.userRepository.updatePasswordByEmail(
      email.toLowerCase(),
      passwordHash,
    );

    return { message: 'Password reset successful' };
  }
}
