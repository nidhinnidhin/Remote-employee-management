import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import type { ISendEmailOtpUseCase } from '../../interfaces/otp/otp-use-case.interface';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { RequestEmailChangeDto } from '../../dto/email-update/request-email-change.dto';
import { IRequestEmailChangeUseCase } from '../../interfaces/profile/profile-use-case.interface';

@Injectable()
export class RequestEmailChangeUseCase implements IRequestEmailChangeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('ISendEmailOtpUseCase')
    private readonly _sendEmailOtpUseCase: ISendEmailOtpUseCase,
  ) { }

  async execute(userId: string, input: RequestEmailChangeDto) {
    const emailLower = input.newEmail.toLowerCase();

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const existing = await this._userRepository.findByEmail(emailLower);
    if (existing) {
      throw new BadRequestException(AUTH_MESSAGES.COMPANY_ALREADY_EXIST);
    }

    await this._sendEmailOtpUseCase.execute({
      userId,
      email: user.email,
      purpose: OtpPurpose.EMAIL_CHANGE,
      newEmail: emailLower,
    });

    return {
      message: OTP_MESSAGES.OTP_SENT,
    };
  }
}
