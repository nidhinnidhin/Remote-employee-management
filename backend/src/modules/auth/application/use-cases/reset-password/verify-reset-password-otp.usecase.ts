import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IEmailOtpRepository } from '../../../domain/repositories/iemail-otp.repository';
import { VerifyResetPasswordOtpDto } from '../../dto/verify-reset-password-otp.dto';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { RedisService } from 'src/shared/services/redis.service';
import { IVerifyResetPasswordOtpUseCase } from '../../interfaces/auth/auth-use-case.interface';

@Injectable()
export class VerifyResetPasswordOtpUseCase implements IVerifyResetPasswordOtpUseCase {
  constructor(
    @Inject('IEmailOtpRepository')
    private readonly _otpRepository: IEmailOtpRepository,

    private readonly _redisService: RedisService,
  ) { }

  async execute(input: VerifyResetPasswordOtpDto) {
    const record = await this._otpRepository.findLatestByEmail(
      input.email.toLowerCase(),
    );

    if (!record) {
      throw new BadRequestException(OTP_MESSAGES.OTP_NOT_FOUND);
    }

    if (record.verified) {
      throw new BadRequestException(OTP_MESSAGES.OTP_ALREADY_USED);
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    const isValidOtp = await bcrypt.compare(input.otp, record.otpHash);
    if (!isValidOtp) {
      throw new BadRequestException(OTP_MESSAGES.OTP_INVALID);
    }

    // Mark OTP verified
    await this._otpRepository.markVerified(record.id);

    // Create reset session
    const resetSessionKey = `reset-password:${input.email.toLowerCase()}`;
    await this._redisService.set(resetSessionKey, 'true', 10 * 60); // 10 min

    return { message: OTP_MESSAGES.OTP_VERIFIED };
  }
}
