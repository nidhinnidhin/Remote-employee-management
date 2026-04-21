import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { IEmailOtpRepository } from '../../../domain/repositories/iemail-otp.repository';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { IVerifyEmailChangeUseCase } from '../../interfaces/profile/profile-use-case.interface';

@Injectable()
export class VerifyEmailChangeUseCase implements IVerifyEmailChangeUseCase {
  constructor(
    @Inject('IEmailOtpRepository')
    private readonly _emailOtpRepository: IEmailOtpRepository,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(userId: string, otp: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const otpRecord = await this._emailOtpRepository.findLatestByUserAndEmail(
      userId,
      user.email,
      OtpPurpose.EMAIL_CHANGE,
    );

    if (!otpRecord) {
      throw new BadRequestException(OTP_MESSAGES.OTP_NOT_FOUND);
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      throw new BadRequestException(OTP_MESSAGES.OTP_INVALID);
    }

    if (!otpRecord.newEmail) {
      throw new BadRequestException(OTP_MESSAGES.OTP_INVALID);
    }

    await this._userRepository.updateEmail(userId, otpRecord.newEmail);
    await this._emailOtpRepository.markVerified(otpRecord.id);

    return { message: AUTH_MESSAGES.EMAIL_UPDATED };
  }
}
