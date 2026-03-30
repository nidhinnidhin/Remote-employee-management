import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ForgotPasswordUseCase } from '../../application/use-cases/reset-password/forgot-password.usecase';
import { LoginUseCase } from '../../application/use-cases/login/login.usecase';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/token/refresh-access-token.usecase';
import { RegisterAdminUseCase } from '../../application/use-cases/register/register-admin.usecase';
import { OnboardCompanyUseCase } from '../../application/use-cases/register/onboard-company.usecase';
import { ResendEmailOtpUseCase } from '../../application/use-cases/otp/resend-email-otp.usecase';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password/reset-password.usecase';
import { SendEmailOtpUseCase } from '../../application/use-cases/otp/send-email-otp.usecase';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/otp/verify-email-otp.usecase';
import { VerifyResetPasswordOtpUseCase } from '../../application/use-cases/reset-password/verify-reset-password-otp.usecase';
import { RedisPendingRegistrationRepository } from '../../infrastructure/cache/auth/pending-registration-repository-infra';
import { AppRedisModule } from '../../infrastructure/cache/redis.module';
import { MongoCompanyRepository } from '../../infrastructure/database/repositories/mongo-company.repository';
import { MongoEmailOtpRepository } from '../../infrastructure/database/repositories/mongo-email-otp.repository';
import { MongoUserRepository } from '../../infrastructure/database/repositories/mongo-user.repository';
import { OtpService } from 'src/shared/services/auth/otp.service';
import { EmailService } from 'src/shared/services/email/email.service';
import { JwtService } from 'src/shared/services/auth/jwt.service';
import { OtpController } from '../controllers/otp.controller';
import { PasswordController } from '../controllers/password.controller';
import { ProfileController } from '../controllers/profile.controller';
import { DocumentController } from '../controllers/document.controller';
import { AuthController } from '../controllers/auth.controller';
import { TestController } from '../controllers/test.controller';
import { EmailOtpSchema } from '../../infrastructure/database/mongoose/schemas/email-otp.schema';
import {
  CompanyDocument,
  CompanySchema,
} from '../../infrastructure/database/mongoose/schemas/company.schema';
import {
  UserDocument,
  UserSchema,
} from '../../infrastructure/database/mongoose/schemas/userSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { SocialLoginUseCase } from '../../application/use-cases/login/social-login.usecase';
import { GetUserProfileUseCase } from '../../application/use-cases/profile/get-user-profile.usecase';
import { UpdateProfileUseCase } from '../../application/use-cases/profile/update-user-profile.useCase';
import { RequestEmailChangeUseCase } from '../../application/use-cases/update-email/request-email-change.usecase';
import { VerifyEmailChangeUseCase } from '../../application/use-cases/update-email/verify-email-change.usecase';
import { UploadProfileImageUseCase } from '../../application/use-cases/profile/upload-profile-image.usecase';
import { CloudinaryService } from 'src/shared/services/cloudinary/cloudinary.service';
import { UpdateSkillsUseCase } from '../../application/use-cases/skills/update-skills.usecase';
import { UploadDocumentUseCase } from '../../application/use-cases/document/upload-document.usecase';
import { DeleteDocumentUseCase } from '../../application/use-cases/document/delete-document.usecase';
import { EditDocumentUseCase } from '../../application/use-cases/document/edit-document.usecase';
import { CookieHelperService } from 'src/shared/services/auth/cookie-helper.service';
import { PasswordService } from 'src/shared/services/auth/password.service';
import {
  DepartmentDocument,
  DepartmentSchema,
} from 'src/modules/department/infrastructure/database/mongoose/schemas/department.schema';
import { MongoDepartmentRepository } from 'src/modules/department/infrastructure/database/repositories/mongo-department.repository';

@Module({
  imports: [
    AppRedisModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: CompanyDocument.name, schema: CompanySchema },
      { name: 'EmailOtp', schema: EmailOtpSchema },
      { name: DepartmentDocument.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [
    AuthController,
    OtpController,
    PasswordController,
    ProfileController,
    DocumentController,
    TestController,
  ],
  providers: [
    JwtAuthGuard,
    {
      provide: 'IRegisterAdminUseCase',
      useClass: RegisterAdminUseCase,
    },
    {
      provide: 'IOnboardCompanyUseCase',
      useClass: OnboardCompanyUseCase,
    },
    {
      provide: 'ILoginUseCase',
      useClass: LoginUseCase,
    },
    {
      provide: 'ISendEmailOtpUseCase',
      useClass: SendEmailOtpUseCase,
    },
    {
      provide: 'IVerifyEmailOtpUseCase',
      useClass: VerifyEmailOtpUseCase,
    },
    {
      provide: 'IResendEmailOtpUseCase',
      useClass: ResendEmailOtpUseCase,
    },
    {
      provide: 'IRefreshAccessTokenUseCase',
      useClass: RefreshAccessTokenUseCase,
    },
    {
      provide: 'IEmailService',
      useClass: EmailService,
    },
    EmailService,
    {
      provide: 'IOtpService',
      useClass: OtpService,
    },
    OtpService,
    {
      provide: 'IJwtService',
      useClass: JwtService,
    },
    JwtService,
    {
      provide: 'IForgotPasswordUseCase',
      useClass: ForgotPasswordUseCase,
    },
    {
      provide: 'IVerifyResetPasswordOtpUseCase',
      useClass: VerifyResetPasswordOtpUseCase,
    },
    {
      provide: 'IResetPasswordUseCase',
      useClass: ResetPasswordUseCase,
    },
    {
      provide: 'ISocialLoginUseCase',
      useClass: SocialLoginUseCase,
    },
    {
      provide: 'IGetUserProfileUseCase',
      useClass: GetUserProfileUseCase,
    },
    {
      provide: 'IUpdateProfileUseCase',
      useClass: UpdateProfileUseCase,
    },
    {
      provide: 'IRequestEmailChangeUseCase',
      useClass: RequestEmailChangeUseCase,
    },
    {
      provide: 'IVerifyEmailChangeUseCase',
      useClass: VerifyEmailChangeUseCase,
    },
    {
      provide: 'IUploadProfileImageUseCase',
      useClass: UploadProfileImageUseCase,
    },
    {
      provide: 'ICloudinaryService',
      useClass: CloudinaryService,
    },
    CloudinaryService,
    {
      provide: 'IPasswordService',
      useClass: PasswordService,
    },
    PasswordService,
    {
      provide: 'IUpdateSkillsUseCase',
      useClass: UpdateSkillsUseCase,
    },
    {
      provide: 'IUploadDocumentUseCase',
      useClass: UploadDocumentUseCase,
    },
    {
      provide: 'IDeleteDocumentUseCase',
      useClass: DeleteDocumentUseCase,
    },
    {
      provide: 'IEditDocumentUseCase',
      useClass: EditDocumentUseCase,
    },
    {
      provide: 'ICookieHelperService',
      useClass: CookieHelperService,
    },
    {
      provide: 'IPendingRegistrationRepository',
      useClass: RedisPendingRegistrationRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: MongoUserRepository,
    },
    {
      provide: 'ICompanyRepository',
      useClass: MongoCompanyRepository,
    },
    {
      provide: 'IEmailOtpRepository',
      useClass: MongoEmailOtpRepository,
    },
    {
      provide: 'IDepartmentRepository',
      useClass: MongoDepartmentRepository,
    },
  ],
  exports: [
    JwtService,
    'IJwtService',
    'IUserRepository',
    'ICompanyRepository',
    'IEmailOtpRepository',
    EmailService,
    'IEmailService',
    'ICookieHelperService',
    'IPasswordService',
    'IOtpService',
  ],
})
export class AuthModule { }
