import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { SendEmailOtpUseCase } from './send-email-otp.usecase';
import { UserStatus } from '@shared';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(
      email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('User is not active');
    }

    // ✅ Reuse existing OTP logic (same as registration)
    await this.sendEmailOtpUseCase.execute(
      user.id,
      user.email,
    );

    return { message: 'OTP sent to registered email' };
  }
}
