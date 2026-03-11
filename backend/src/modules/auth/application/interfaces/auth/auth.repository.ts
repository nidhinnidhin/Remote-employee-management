import { ForgotPasswordDto } from 'src/modules/auth/presentation/dto/forgot-password.dto';
import { RegisterAdminDto } from 'src/modules/auth/presentation/dto/register-admin.dto';
import { ResetPasswordDto } from 'src/modules/auth/presentation/dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from 'src/modules/auth/presentation/dto/verify-reset-password-otp.dto';
import { LoginInput } from 'src/shared/types/auth/login-input.type';
import { LoginResponse } from 'src/shared/types/auth/login-response.type';
import {
  SocialLoginInput,
  SocialLoginResponse,
} from 'src/shared/types/auth/social-login.type';

export interface IAuthRepository {
  login(input: LoginInput): Promise<LoginResponse>;

  registerAdmin(dto: RegisterAdminDto): Promise<any>;

  socialLogin(input: SocialLoginInput): Promise<SocialLoginResponse>;

  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>;

  forgotPassword(input: ForgotPasswordDto): Promise<any>;

  verifyResetPasswordOtp(input: VerifyResetPasswordOtpDto): Promise<any>;

  resetPassword(input: ResetPasswordDto): Promise<any>;
}