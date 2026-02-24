import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { EmailOtpRepository } from '../../../domain/repositories/email-otp.repository';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';

@Injectable()
export class VerifyEmailChangeUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly emailOtpRepository: EmailOtpRepository,

    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, otp: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const otpRecord = await this.emailOtpRepository.findLatestByUserAndEmail(
      userId,
      user.email,
      OtpPurpose.EMAIL_CHANGE, // VERY IMPORTANT
    );

    console.log('OTP Record:', otpRecord);

    if (!otpRecord) {
      throw new BadRequestException('OTP not found');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // 🔥 Update to stored newEmail
    if (!otpRecord.newEmail) {
      throw new BadRequestException('Invalid OTP record');
    }

    await this.userRepository.updateEmail(userId, otpRecord.newEmail);
    await this.emailOtpRepository.markVerified(otpRecord.id);

    return { message: 'Email updated successfully' };
  }
}
