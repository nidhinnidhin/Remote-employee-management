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

  // LOGIN with Access + Refresh Token
  @Post('login')
  async login(
    @Body() dto: LoginCompanyAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.loginCompanyAdminUseCase.execute(dto.email, dto.password);

    // Store refresh token in HTTP-only cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    return {
      accessToken,
    };
  }

  // Register
  @Post('register')
  async register(@Body() dto: RegisterCompanyAdminDto) {
    const user = await this.registerCompanyAdminUseCase.execute(dto);

    return {
      message: 'Registration successful. Please verify OTP.',
      userId: user.id,
    };
  }

  // Verify OTP
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyEmailOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = await this.verifyEmailOtpUseCase.execute(dto.email, dto.otp);

    return {
      message: 'OTP verified successfully',
      userId,
    };
  }

  // Resend OTP
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.resendEmailOtpUseCase.execute(dto.email);

    return {
      message: 'OTP resent successfully',
    };
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    console.log('Hitted', req.cookies);
    const refreshToken = req.cookies?.refresh_token;
    console.log(refreshToken);
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const accessToken =
      await this.refreshAccessTokenUseCase.execute(refreshToken);

    return { accessToken };
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto.email);
  }

  @Post('verify-reset-password-otp')
  verifyResetOtp(@Body() dto: VerifyResetPasswordOtpDto) {
    return this.verifyResetPasswordOtpUseCase.execute(dto.email, dto.otp);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto.email, dto.newPassword);
  }
}
