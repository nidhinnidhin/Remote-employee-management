import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ForgotPasswordUseCase } from '../../application/use-cases/forgot-password.usecase';
import { LoginCompanyAdminUseCase } from '../../application/use-cases/login-company-admin.useCase';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.usecase';
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register-company-admin.usecase';
import { ResendEmailOtpUseCase } from '../../application/use-cases/resend-email-otp.usecase';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password.usecase';
import { SendEmailOtpUseCase } from '../../application/use-cases/send-email-otp.usecase';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/verify-email-otp.usecase';
import { VerifyResetPasswordOtpUseCase } from '../../application/use-cases/verify-reset-password-otp.usecase';
import { RedisPendingRegistrationRepository } from '../cache/auth/pending-registration-repository-infra';
import { AppRedisModule } from '../cache/redis.module';
import { MongoCompanyRepository } from '../database/repositories/mongo-company.repository';
import { MongoEmailOtpRepository } from '../database/repositories/mongo-email-otp.repository';
import { MongoUserRepository } from '../database/repositories/mongo-user.repository';
import { EmailService } from '../notifications/email.service';
import { JwtService } from './jwt.service';
import { AuthController } from '../../interface/controllers/auth.controller';
import { TestController } from '../../interface/controllers/test.controller';
import { EmailOtpSchema } from '../database/mongoose/schemas/email-otp.schema';
import { CompanyDocument, CompanySchema } from '../database/mongoose/schemas/company.schema';
import { UserDocument, UserSchema } from '../database/mongoose/schemas/userSchema';
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
    LoginCompanyAdminUseCase,
    SendEmailOtpUseCase,
    VerifyEmailOtpUseCase,
    ResendEmailOtpUseCase,
    RefreshAccessTokenUseCase,
    EmailService,
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
  exports: [JwtService],
})
export class AuthModule {}
