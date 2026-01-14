import { Body, Controller, Post, Header } from '@nestjs/common';
import { serialize } from 'cookie';
import { RegisterCompanyAdminUseCase } from '../../../application/use-cases/register-company-admin.usecase';
import { VerifyEmailOtpUseCase } from '../../../application/use-cases/verify-email-otp.usecase';
import { JwtService } from '../../../infrastructure/auth/jwt.service';
import { RegisterCompanyAdminDto } from '../../../presentation/dto/register-company-admin.dto';
import { VerifyEmailOtpDto } from 'src/presentation/dto/verify-email-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCompanyAdminUseCase: RegisterCompanyAdminUseCase,
    private readonly verifyEmailOtpUseCase: VerifyEmailOtpUseCase,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTER
  @Post('register')
  async register(@Body() dto: RegisterCompanyAdminDto) {
    const user = await this.registerCompanyAdminUseCase.execute(dto);

    return {
      message: 'Registration successful. Please verify OTP.',
      userId: user.id,
    };
  }

  // VERIFY OTP + SET JWT COOKIE
  @Post('verify-otp')
  @Header('Set-Cookie', '')
  async verifyOtp(@Body() dto: VerifyEmailOtpDto) {
    const userId = await this.verifyEmailOtpUseCase.execute(dto.email, dto.otp);

    const token = this.jwtService.generateToken({ userId });

    const cookie = serialize('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return {
      message: 'OTP verified successfully',
      cookie, // returned only so Nest can attach header
    };
  }
}
