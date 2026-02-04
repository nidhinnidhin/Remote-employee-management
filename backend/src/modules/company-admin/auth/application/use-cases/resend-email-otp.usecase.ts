import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { PendingRegistrationRepository } from '../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { EmailService } from '../../../../../shared/services/email.service';
import { OtpService } from 'src/shared/services/otp.service';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';

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
      throw new BadRequestException(OTP_MESSAGES.OTP_EXPIRED);
    }

    const otp = this.otpService.generateOtp();
    const otpHash = await this.otpService.hashOtp(otp);
    const expiresAt = new Date(Date.now() + 60_000); 

    await this.pendingRepository.save(
      email,
      {
        ...pending,
        otpHash,
        expiresAt,
      },
      60,
    );

    await this.emailService.sendOtp(email, otp);
  }
}
