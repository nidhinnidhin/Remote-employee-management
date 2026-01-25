import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { SendEmailOtpUseCase } from './send-email-otp.usecase';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) {}

  async execute({ email }: { email: string }): Promise<void> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_ACTIVE);
    }

    await this.sendEmailOtpUseCase.execute({
      userId: user.id,
      email: user.email,
    });
  }
}
