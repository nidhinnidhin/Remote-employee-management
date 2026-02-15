import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ForgotPasswordUseCase } from '../../application/use-cases/reset-password/forgot-password.usecase';
import { LoginUseCase } from '../../application/use-cases/login/login.usecase';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/token/refresh-access-token.usecase';
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register/register-company-admin.usecase';
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
import { OtpService } from 'src/shared/services/otp.service';
import { EmailService } from '../../../../../shared/services/email.service';
import { JwtService } from '../../../../../shared/services/jwt.service';
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

@Module({
  imports: [
    AppRedisModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: CompanyDocument.name, schema: CompanySchema },
      { name: 'EmailOtp', schema: EmailOtpSchema },
    ]),
  ],
  controllers: [AuthController, TestController],
  providers: [
    JwtAuthGuard,
    RegisterCompanyAdminUseCase,
    LoginUseCase,
    SendEmailOtpUseCase,
    VerifyEmailOtpUseCase,
    ResendEmailOtpUseCase,
    RefreshAccessTokenUseCase,
    EmailService,
    OtpService,
    JwtService,
    ForgotPasswordUseCase,
    VerifyResetPasswordOtpUseCase,
    ResetPasswordUseCase,
    {
      provide: 'PendingRegistrationRepository',
      useClass: RedisPendingRegistrationRepository,
    },
    {
      provide: 'UserRepository',
      useClass: MongoUserRepository,
    },
    {
      provide: 'CompanyRepository',
      useClass: MongoCompanyRepository,
    },
    {
      provide: 'EmailOtpRepository',
      useClass: MongoEmailOtpRepository,
    },
  ],
  exports: [
    JwtService,
    'UserRepository',
    'CompanyRepository',
    'EmailOtpRepository',
  ],
})
export class AuthModule {}
