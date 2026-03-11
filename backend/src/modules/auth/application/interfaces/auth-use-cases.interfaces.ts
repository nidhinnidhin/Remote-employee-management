import { LoginInput } from 'src/shared/types/auth/login-input.type';
import { LoginResponse } from 'src/shared/types/auth/login-response.type';
import { RegisterAdminDto } from '../../presentation/dto/register-admin.dto';
import { OnboardingDto } from '../../presentation/dto/onboarding.dto';
import { VerifyEmailOtpDto } from '../../presentation/dto/verify-email-otp.dto';
import { ResendOtpDto } from '../../presentation/dto/resend-otp.dto';
import { SendEmailOtpInput } from 'src/shared/types/company/otp/send-email-otp-input.type';
import { SocialLoginInput, SocialLoginResponse } from 'src/shared/types/auth/social-login.type';
import { RefreshAccessTokenResponse } from 'src/shared/types/jwt/refresh-access-token-response.type';
import { UpdateProfileDto } from '../../presentation/dto/update-profile.dto';
import { RequestEmailChangeDto } from '../../presentation/dto/email-update/request-email-change.dto';
import { ForgotPasswordDto } from '../../presentation/dto/forgot-password.dto';
import { ResetPasswordDto } from '../../presentation/dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from '../../presentation/dto/verify-reset-password-otp.dto';
import { UploadDocumentInput, UploadDocumentResponse } from 'src/shared/types/profile/upload-document.type';
import { EditDocumentInput, EditDocumentResponse } from 'src/shared/types/profile/edit-document.type';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';

export interface ILoginUseCase {
    execute(input: LoginInput): Promise<LoginResponse>;
}

export interface IRegisterAdminUseCase {
    execute(dto: RegisterAdminDto): Promise<any>;
}

export interface IOnboardCompanyUseCase {
    execute(userId: string, dto: OnboardingDto): Promise<any>;
}

export interface IVerifyEmailOtpUseCase {
    execute(input: VerifyEmailOtpDto): Promise<any>;
}

export interface IResendEmailOtpUseCase {
    execute(input: ResendOtpDto): Promise<void>;
}

export interface ISendEmailOtpUseCase {
    execute(input: SendEmailOtpInput): Promise<void>;
}

export interface ISocialLoginUseCase {
    execute(input: SocialLoginInput): Promise<SocialLoginResponse>;
}

export interface IRefreshAccessTokenUseCase {
    execute(refreshToken: string): Promise<RefreshAccessTokenResponse>;
}

export interface IGetUserProfileUseCase {
    execute(userId: string): Promise<any>;
}

export interface IUpdateProfileUseCase {
    execute(userId: string, dto: UpdateProfileDto): Promise<any>;
}

export interface IRequestEmailChangeUseCase {
    execute(userId: string, dto: RequestEmailChangeDto): Promise<any>;
}

export interface IVerifyEmailChangeUseCase {
    execute(userId: string, otp: string): Promise<any>;
}

export interface IUploadProfileImageUseCase {
    execute(userId: string, file: any): Promise<any>;
}

export interface IUpdateSkillsUseCase {
    execute(userId: string, skills: string[]): Promise<any>;
}

export interface IUploadDocumentUseCase {
    execute(input: UploadDocumentInput): Promise<UploadDocumentResponse>;
}

export interface IEditDocumentUseCase {
    execute(input: EditDocumentInput): Promise<EditDocumentResponse>;
}

export interface IDeleteDocumentUseCase {
    execute(userId: string, documentId: string, publicId: string, resourceType: CloudinaryResourceType): Promise<any>;
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
