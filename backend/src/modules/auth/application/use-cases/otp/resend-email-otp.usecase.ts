import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { PendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { EmailService } from 'src/shared/services/email.service';
import { OtpService } from 'src/shared/services/otp.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { getOtpExpiresAt, SESSION_TTL_SECONDS } from 'src/shared/constants/functions/otp/otp.constants';

@Injectable()
export class ResendEmailOtpUseCase {
  constructor(
    @Inject('PendingRegistrationRepository')
    private readonly pendingRepository: PendingRegistrationRepository,
    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
  ) {}

  async execute(email: string): Promise<void> {
    const pending = await this.pendingRepository.find(email);

    if (!pending) {
      throw new BadRequestException(AUTH_MESSAGES.SESSION_EXPIRED);
    }

    const otp = this.otpService.generateOtp();
    const otpHash = await this.otpService.hashOtp(otp);

    await this.pendingRepository.save(
      email,
      { ...pending, otpHash, expiresAt: getOtpExpiresAt() },
      SESSION_TTL_SECONDS,
    );

    await this.emailService.sendOtp(email, otp);
  }
}