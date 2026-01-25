import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { SendEmailOtpUseCase } from './send-email-otp.usecase';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

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
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === 'ACTIVE') {
      throw new BadRequestException(AUTH_MESSAGES.USER_ALEADY_VERIFIED);
    }

    // Reuse existing OTP sending logic
    await this.sendEmailOtpUseCase.execute({
      userId: user.id,
      email: user.email,
    });
  }
}
