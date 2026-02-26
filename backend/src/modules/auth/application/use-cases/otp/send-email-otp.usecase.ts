import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EmailService } from 'src/shared/services/email.service';
import type { EmailOtpRepository } from '../../../domain/repositories/email-otp.repository';
import { EmailOtpEntity } from '../../../domain/entities/email-otp.entity';
import { SendEmailOtpInput } from 'src/shared/types/company/otp/send-email-otp-input.type';
import { OtpService } from 'src/shared/services/otp.service';

@Injectable()
export class SendEmailOtpUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly _emailOtpRepository: EmailOtpRepository,
    private readonly _emailService: EmailService,
    private readonly _otpService: OtpService,
  ) {}

  async execute(input: SendEmailOtpInput): Promise<void> {
    const otp = this._otpService.generateOtp();
    const otpHash = await this._otpService.hashOtp(otp);
    const expiresAt = this._otpService.getExpiryDate();

    console.log(
      `📧 Sending OTP to: ${input.email} | Purpose: ${input.purpose} | OTP: ${otp}`,
    );

    const otpEntity = new EmailOtpEntity(
      randomUUID(),
      input.userId,
      input.email,
      otpHash,
      expiresAt,
      false,
      new Date(),
      input.newEmail,
      input.purpose,
    );

    await this._emailOtpRepository.create(otpEntity);
    await this._emailService.sendOtp(input.email, otp);
  }
}
