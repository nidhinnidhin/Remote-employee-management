import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/presentation/auth/auth.module';
import { MongoDatabaseModule } from './shared/config/mongoose.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CompanyPolicyModule } from './modules/company-admin/company-policy.module';
import { ResponseInterceptor } from './common/response/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DepartmentModule } from './modules/department/presentation/department.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongoDatabaseModule,
    AuthModule,
    SuperAdminModule,
    EmployeesModule,
    CompanyPolicyModule,
    DepartmentModule,
    ProjectModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
