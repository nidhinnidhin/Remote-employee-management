import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from '../../interfaces/http/controllers/auth.controller';
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register-company-admin.usecase';
import { MongoUserRepository } from '../database/repositories/mongo-user.repository';
import { UserDocument } from '../database/mongoose/schemas/userSchema';
import { UserSchema } from '../database/mongoose/schemas/userSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    RegisterCompanyAdminUseCase,
    {
      provide: 'UserRepository',
      useClass: MongoUserRepository,
    },
  ],
})
export class AuthModule {}
