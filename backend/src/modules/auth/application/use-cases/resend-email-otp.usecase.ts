import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { SendEmailOtpUseCase } from './send-email-otp.usecase';

@Injectable()
export class ResendEmailOtpUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status === 'ACTIVE') {
      throw new BadRequestException('User already verified');
    }

    // 🔁 Reuse existing OTP sending logic
    await this.sendEmailOtpUseCase.execute(user.id, user.email);
  }
}
