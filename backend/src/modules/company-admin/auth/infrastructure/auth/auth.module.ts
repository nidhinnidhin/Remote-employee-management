import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../../interfaces/controllers/auth.controller';
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register-company-admin.usecase';
import { SendEmailOtpUseCase } from '../../application/use-cases/send-email-otp.usecase';
import { MongoUserRepository } from '../database/repositories/mongo-user.repository';
import { MongoEmailOtpRepository } from '../database/repositories/mongo-email-otp.repository';
import { EmailService } from '../notifications/email.service';
import { UserDocument } from '../database/mongoose/schemas/userSchema';
import { UserSchema } from '../database/mongoose/schemas/userSchema';
import { EmailOtpSchema } from '../database/mongoose/schemas/email-otp.schema';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/verify-email-otp.usecase';
import { JwtService } from './jwt.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TestController } from 'src/modules/company-admin/auth/interfaces/controllers/test.controller';
import { LoginCompanyAdminUseCase } from '../../application/use-cases/login-company-admin.useCase';
import { ResendEmailOtpUseCase } from '../../application/use-cases/resend-email-otp.usecase';
import {
  RefreshTokenDocument,
  RefreshTokenSchema,
} from '../database/mongoose/schemas/refresh-token.schema';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/refresh-access-token.usecase';
import { MongoRefreshTokenRepository } from '../database/repositories/mongo-refresh-token.repository';
import { MongoCompanyRepository } from '../database/repositories/mongo-company.repository';
import { CompanyDocument, CompanySchema } from '../database/mongoose/schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: CompanyDocument.name, schema: CompanySchema },
      { name: 'EmailOtp', schema: EmailOtpSchema },
      { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
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
    {
      provide: 'RefreshTokenRepository',
      useClass: MongoRefreshTokenRepository,
    },
  ],
  exports: [JwtService, 'RefreshTokenRepository'],
})
export class AuthModule {}
