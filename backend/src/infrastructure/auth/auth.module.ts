import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../../interfaces/http/controllers/auth.controller';
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register-company-admin.usecase';
import { SendEmailOtpUseCase } from '../../application/use-cases/send-email-otp.usecase';
import { MongoUserRepository } from '../database/repositories/mongo-user.repository';
import { MongoEmailOtpRepository } from '../database/repositories/mongo-email-otp.repository';
import { EmailService } from '../notifications/email.service';
import { UserDocument } from '../database/mongoose/schemas/userSchema';
import { UserSchema } from '../database/mongoose/schemas/userSchema';
import { EmailOtpSchema } from '../database/mongoose/schemas/email-otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: 'EmailOtp', schema: EmailOtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    RegisterCompanyAdminUseCase,
    SendEmailOtpUseCase,
    EmailService,
    {
      provide: 'UserRepository',
      useClass: MongoUserRepository,
    },
    {
      provide: 'EmailOtpRepository',
      useClass: MongoEmailOtpRepository,
    },
  ],
})
export class AuthModule {}
