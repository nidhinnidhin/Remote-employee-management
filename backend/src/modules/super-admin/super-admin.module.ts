import { Module } from '@nestjs/common';
import { SuperAdminAuthController } from './interfaces/controllers/super-admin-auth.controller';
import { LoginSuperAdminUseCase } from './application/use-cases/login-super-admin.usecase';
import { AuthModule } from '../company-admin/auth/infrastructure/auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [SuperAdminAuthController],
  providers: [
    LoginSuperAdminUseCase,
  ],
})
export class SuperAdminModule { }
