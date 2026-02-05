import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { PendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { EmailService } from 'src/shared/services/email.service';
import { OtpService } from 'src/shared/services/otp.service';

@Injectable()
export class ResendEmailOtpUseCase {
  constructor(
    @Inject('PendingRegistrationRepository')
    private readonly pendingRepository: PendingRegistrationRepository,

    private readonly emailService: EmailService,
    private readonly otpService: OtpService,
  ) { }

  async execute(email: string): Promise<void> {
    const pending = await this.pendingRepository.find(email);

    if (!pending) {
      throw new BadRequestException("Registration session expired. Please register again.");
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
      900, // Refresh session TTL to 15 mins
    );

    await this.emailService.sendOtp(email, otp);
  }
}
