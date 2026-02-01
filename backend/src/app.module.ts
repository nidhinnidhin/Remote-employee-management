import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/company-admin/auth/presentation/auth/auth.module';
import { MongoDatabaseModule } from './shared/config/mongoose.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { EmployeesModule } from './modules/company-admin/employees/presentation/employee/employees.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoDatabaseModule,
    AuthModule,
    SuperAdminModule,
    EmployeesModule
  ],
})
export class AppModule {}
