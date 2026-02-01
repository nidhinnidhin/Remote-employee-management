import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailService } from '../../../../../shared/services/email.service';
import type { EmailOtpRepository } from '../../domain/repositories/email-otp.repository';
import { EmailOtpEntity } from '../../domain/entities/email-otp.entity';
import { OtpPurpose } from 'src/shared/enums/reset-password/otp-purpose.enum';
import { SendEmailOtpInput } from 'src/shared/types/company/otp/send-email-otp-input.type';

@Injectable()
export class SendEmailOtpUseCase {
  constructor(
    @Inject('EmailOtpRepository')
    private readonly emailOtpRepository: EmailOtpRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(input: SendEmailOtpInput): Promise<void> {

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpEntity = new EmailOtpEntity(
      randomUUID(),
      input.userId,
      input.email,
      otpHash,
      expiresAt,
      false,
      new Date(),
    );

    await this.emailOtpRepository.create(otpEntity);
    await this.emailService.sendOtp(input.email, otp);
  }
}
