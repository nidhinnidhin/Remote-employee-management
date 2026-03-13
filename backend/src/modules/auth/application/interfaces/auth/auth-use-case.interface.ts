import { LoginInput } from 'src/shared/types/auth/login-input.type';
import { LoginResponse } from 'src/shared/types/auth/login-response.type';
import { RegisterAdminDto } from '../../../presentation/dto/register-admin.dto';
import { SocialLoginInput, SocialLoginResponse } from 'src/shared/types/auth/social-login.type';
import { RefreshAccessTokenResponse } from 'src/shared/types/jwt/refresh-access-token-response.type';
import { ForgotPasswordDto } from '../../../presentation/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../../presentation/dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from '../../../presentation/dto/verify-reset-password-otp.dto';

export interface ILoginUseCase {
    execute(input: LoginInput): Promise<LoginResponse>;
}

export interface ISocialLoginUseCase {
    execute(input: SocialLoginInput): Promise<SocialLoginResponse>;
}

export interface IRefreshAccessTokenUseCase {
    execute(refreshToken: string): Promise<RefreshAccessTokenResponse>;
}

export interface IRegisterAdminUseCase {
    execute(dto: RegisterAdminDto): Promise<any>;
}

export interface IForgotPasswordUseCase {
    execute(input: ForgotPasswordDto): Promise<any>;
}

export interface IResetPasswordUseCase {
    execute(input: ResetPasswordDto): Promise<any>;
}

export interface IVerifyResetPasswordOtpUseCase {
    execute(input: VerifyResetPasswordOtpDto): Promise<any>;
}
