import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import type { IRedisService } from 'src/shared/services/redis/interfaces/iredis.service';
import { ResetPasswordDto } from '../../dto/reset-password.dto';
import { IResetPasswordUseCase } from '../../interfaces/auth/auth-use-case.interface';

@Injectable()
export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IRedisService')
    private readonly _redisService: IRedisService,
  ) { }

  async execute(input: ResetPasswordDto) {
    const email = input.email.toLowerCase();
    const redisKey = `reset-password:${email}`;

    const resetAllowed = await this._redisService.get(redisKey);

    if (!resetAllowed) {
      throw new BadRequestException(OTP_MESSAGES.OTP_NOT_VERIFIED);
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);

    await this._userRepository.updatePasswordByEmail(email, passwordHash);

    // Cleanup
    await this._redisService.del(redisKey);

    return { message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS };
  }
}
