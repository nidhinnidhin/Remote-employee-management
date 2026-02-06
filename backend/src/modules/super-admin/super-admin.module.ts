import { Module } from '@nestjs/common';
import { SuperAdminAuthController } from './presentation/controllers/super-admin-auth.controller';
import { LoginSuperAdminUseCase } from './application/use-cases/auth/login-super-admin.usecase';
import { AuthModule } from '../company-admin/auth/presentation/auth/auth.module';

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
