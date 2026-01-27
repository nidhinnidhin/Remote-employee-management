import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register-company-admin.usecase';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/verify-email-otp.usecase';
import { LoginCompanyAdminUseCase } from 'src/modules/company-admin/auth/application/use-cases/login-company-admin.useCase';
import { ResendEmailOtpUseCase } from 'src/modules/company-admin/auth/application/use-cases/resend-email-otp.usecase';

import { RegisterCompanyAdminDto } from '../../presentation/dto/register-company-admin.dto';
import { VerifyEmailOtpDto } from '../../presentation/dto/verify-email-otp.dto';
import { LoginCompanyAdminDto } from '../../presentation/dto/login-company-admin.dto';
import { ResendOtpDto } from 'src/modules/company-admin/auth/presentation/dto/resend-otp.dto';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.usecase';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.usecase';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.usecase';
import { VerifyResetPasswordOtpUseCase } from '../../application/use-cases/verify-reset-password-otp.usecase';
import { ResetPasswordDto } from '../../presentation/dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from '../../presentation/dto/verify-reset-password-otp.dto';
import { ForgotPasswordDto } from '../../presentation/dto/forgot-password.dto';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCompanyAdminUseCase: RegisterCompanyAdminUseCase,
    private readonly verifyEmailOtpUseCase: VerifyEmailOtpUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly loginCompanyAdminUseCase: LoginCompanyAdminUseCase,
    private readonly resendEmailOtpUseCase: ResendEmailOtpUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyResetPasswordOtpUseCase: VerifyResetPasswordOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  // LOGIN
  @Post('login')
  async login(
    @Body() dto: LoginCompanyAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('Login Hitted');
    const { accessToken, refreshToken } =
      await this.loginCompanyAdminUseCase.execute({
        email: dto.email,
        password: dto.password,
      });

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return { accessToken };
  }

  // Register
  @Post('register')
  async register(@Body() dto: RegisterCompanyAdminDto) {
    return this.registerCompanyAdminUseCase.execute(dto);
  }

  // Verify Email OTP
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyEmailOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('VERIFY OTP CONTROLLER HIT', dto);

    const { accessToken, refreshToken } =
      await this.verifyEmailOtpUseCase.execute({
        email: dto.email,
        otp: dto.otp,
      });

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return { accessToken };
  }

  // Resend OTP
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.resendEmailOtpUseCase.execute(dto.email);

    return { message: OTP_MESSAGES.OTP_RESENT };
  }

  // Refresh Access Token
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.MISSING_REFRESH_TOKEN);
    }

    const { accessToken } =
      await this.refreshAccessTokenUseCase.execute(refreshToken);

    return { accessToken };
  }

  // Forgot Password
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.execute({ email: dto.email });
    return { message: OTP_MESSAGES.OTP_SENT };
  }

  // Verify Reset Password OTP
  @Post('verify-reset-password-otp')
  verifyResetOtp(@Body() dto: VerifyResetPasswordOtpDto) {
    return this.verifyResetPasswordOtpUseCase.execute({
      email: dto.email,
      otp: dto.otp,
    });
  }

  // Reset Password
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute({
      email: dto.email,
      newPassword: dto.newPassword,
    });
  }
}
