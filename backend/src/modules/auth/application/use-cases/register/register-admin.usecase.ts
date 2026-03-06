import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../../domain/repositories/company.repository';
import type { PendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { RegisterCompanyAdminDto } from 'src/modules/auth/presentation/dto/register-company-admin.dto';
import { EmailService } from 'src/shared/services/email.service';
import { OtpService } from 'src/shared/services/otp.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { hashPassword } from 'src/shared/utils/password.util';
import { getOtpExpiresAt, SESSION_TTL_SECONDS } from 'src/shared/constants/functions/otp/otp.constants';

import { RegisterAdminDto } from 'src/modules/auth/presentation/dto/register-admin.dto';

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,

    @Inject('PendingRegistrationRepository')
    private readonly _pendingRepository: PendingRegistrationRepository,

    private readonly _emailService: EmailService,
    private readonly _otpService: OtpService,
  ) { }

  async execute(dto: RegisterAdminDto) {
    const existingUser = await this._userRepository.findByEmail(
      dto.email.toLowerCase(),
    );

    if (existingUser) {
      throw new ConflictException(AUTH_MESSAGES.USER_ALREADY_EXIST);
    }

    const otp = this._otpService.generateOtp();
    const otpHash = await this._otpService.hashOtp(otp);
    const passwordHash = await hashPassword(dto.password);

    await this._pendingRepository.save(
      dto.email,
      {
        admin: { ...dto, password: passwordHash },
        otpHash,
        expiresAt: getOtpExpiresAt(),
      },
      SESSION_TTL_SECONDS,
    );

    await this._emailService.sendOtp(dto.email, otp);

    return { success: true, message: OTP_MESSAGES.OTP_SENT };
  }
}

