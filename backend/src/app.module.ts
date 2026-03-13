import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/presentation/auth/auth.module';
import { MongoDatabaseModule } from './shared/config/mongoose.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CompanyPolicyModule } from './modules/company-admin/company-policy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongoDatabaseModule,
    AuthModule,
    SuperAdminModule,
    EmployeesModule,
    CompanyPolicyModule
  ],
})
export class AppModule { }
