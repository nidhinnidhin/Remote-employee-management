import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { RegisterCompanyAdminUseCase } from '../../../application/use-cases/register-company-admin.usecase';
import { VerifyEmailOtpUseCase } from '../../../application/use-cases/verify-email-otp.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { RegisterCompanyAdminDto } from '../../../presentation/dto/register-company-admin.dto';
import { VerifyEmailOtpDto } from '../../../presentation/dto/verify-email-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCompanyAdminUseCase: RegisterCompanyAdminUseCase,
    private readonly verifyEmailOtpUseCase: VerifyEmailOtpUseCase,
    private readonly jwtService: JwtService,
  ) {}

  // Register
  @Post('register')
  async register(@Body() dto: RegisterCompanyAdminDto) {
    const user = await this.registerCompanyAdminUseCase.execute(dto);

    return {
      message: 'Registration successful. Please verify OTP.',
      userId: user.id,
    };
  }

  // Verify otp
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyEmailOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = await this.verifyEmailOtpUseCase.execute(dto.email, dto.otp);

    const token = this.jwtService.generateToken({ userId });

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      message: 'OTP verified successfully',
    };
  }
}
