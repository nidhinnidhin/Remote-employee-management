import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import type { EmailOtpRepository } from '../../../domain/repositories/email-otp.repository';
import { ResetPasswordInput } from 'src/shared/types/company/reset-password/reset-password-input.type';
import { ResetPasswordResponse } from 'src/shared/types/company/reset-password/reset-password-response.type';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { RedisService } from 'src/shared/services/redis.service';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    private readonly redisService: RedisService,
  ) {}

  async execute(input: ResetPasswordInput) {
    const email = input.email.toLowerCase();
    const redisKey = `reset-password:${email}`;

    const resetAllowed = await this.redisService.get(redisKey);

    if (!resetAllowed) {
      throw new BadRequestException(OTP_MESSAGES.OTP_NOT_VERIFIED);
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);

    await this.userRepository.updatePasswordByEmail(email, passwordHash);

    // Cleanup
    await this.redisService.del(redisKey);

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS };
  }
}
