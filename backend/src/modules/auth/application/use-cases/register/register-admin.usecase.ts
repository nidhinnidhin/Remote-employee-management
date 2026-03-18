import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import type { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import type { IPendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/ipending-registration.repository';
import { RegisterCompanyAdminDto } from 'src/modules/auth/application/dto/register-company-admin.dto';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';
import type { IOtpService } from 'src/shared/services/auth/interfaces/iotp.service';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { hashPassword } from 'src/shared/utils/password.util';
import { getOtpExpiresAt, SESSION_TTL_SECONDS } from 'src/shared/constants/functions/otp/otp.constants';

import { RegisterAdminDto } from 'src/modules/auth/application/dto/register-admin.dto';
import { IRegisterAdminUseCase } from '../../interfaces/auth/auth-use-case.interface';

@Injectable()
export class RegisterAdminUseCase implements IRegisterAdminUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IPendingRegistrationRepository')
    private readonly _pendingRepository: IPendingRegistrationRepository,

    @Inject('IEmailService')
    private readonly _emailService: IEmailService,

    @Inject('IOtpService')
    private readonly _otpService: IOtpService,
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

