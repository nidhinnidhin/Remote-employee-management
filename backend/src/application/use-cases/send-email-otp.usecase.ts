import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailService } from '../../infrastructure/notifications/email.service';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';
import { EmailOtpEntity } from '../../domain/entities/email-otp.entity';

@Injectable()
export class SendEmailOtpUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly emailOtpRepository: EmailOtpRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(userId: string, email: string): Promise<void> {
    console.log('✅ OTP FLOW STARTED');
    console.log('📧 Target email:', email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔢 GENERATED OTP (DEV ONLY):', otp);

    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpEntity = new EmailOtpEntity(
      randomUUID(),
      userId,
      email,
      otpHash,
      expiresAt,
      false,
      new Date(),
    );

    await this.emailOtpRepository.create(otpEntity);
    console.log('✅ OTP SAVED TO DB');

    await this.emailService.sendOtp(email, otp);
    console.log('📩 EMAIL SEND FUNCTION CALLED');
  }
}
