import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IPendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/ipending-registration.repository';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';
import type { IOtpService } from 'src/shared/services/auth/interfaces/iotp.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { getOtpExpiresAt, SESSION_TTL_SECONDS } from 'src/shared/constants/functions/otp/otp.constants';
import { IResendEmailOtpUseCase } from '../../interfaces/otp/otp-use-case.interface';
import { ResendOtpDto } from '../../dto/resend-otp.dto';

@Injectable()
export class ResendEmailOtpUseCase implements IResendEmailOtpUseCase {
  constructor(
    @Inject('IPendingRegistrationRepository')
    private readonly _pendingRepository: IPendingRegistrationRepository,

    @Inject('IEmailService')
    private readonly _emailService: IEmailService,

    @Inject('IOtpService')
    private readonly _otpService: IOtpService,
  ) { }

  async execute(input: ResendOtpDto): Promise<void> {
    const email = input.email;
    const pending = await this._pendingRepository.find(email);

    if (!pending) {
      throw new BadRequestException(AUTH_MESSAGES.SESSION_EXPIRED);
    }

    const otp = this._otpService.generateOtp();
    const otpHash = await this._otpService.hashOtp(otp);

    await this._pendingRepository.save(
      email,
      { ...pending, otpHash, expiresAt: getOtpExpiresAt() },
      SESSION_TTL_SECONDS,
    );

    await this._emailService.sendOtp(email, otp);
  }
}