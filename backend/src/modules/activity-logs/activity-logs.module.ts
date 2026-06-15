import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/presentation/auth/auth.module';
import {
  ActivityLog,
  ActivityLogSchema,
} from './infrastructure/database/mongoose/schemas/activity-log.schema';
import { MongoActivityLogRepository } from './infrastructure/database/repositories/mongo-activity-log.repository';
import { GetEmployeeActivityLogsUseCase } from './application/use-cases/get-employee-activity-logs.usecase';
import { GetCompanyAdminActivityLogsUseCase } from './application/use-cases/get-company-admin-activity-logs.usecase';
import { GetSuperAdminActivityLogsUseCase } from './application/use-cases/get-super-admin-activity-logs.usecase';
import { ActivityLogController } from './presentation/controllers/activity-log.controller';
import { CreateActivityLogUseCase } from './application/use-cases/create-activity-log.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ActivityLogController],
  providers: [
    { provide: 'IActivityLogRepository', useClass: MongoActivityLogRepository },
    {
      provide: 'IGetEmployeeActivityLogsUseCase',
      useClass: GetEmployeeActivityLogsUseCase,
    },
    {
      provide: 'IGetCompanyAdminActivityLogsUseCase',
      useClass: GetCompanyAdminActivityLogsUseCase,
    },
    {
      provide: 'IGetSuperAdminActivityLogsUseCase',
      useClass: GetSuperAdminActivityLogsUseCase,
    },
    {
      provide: 'ICreateActivityLogUseCase',
      useClass: CreateActivityLogUseCase,
    },
  ],
  exports: ['IActivityLogRepository', 'ICreateActivityLogUseCase'],
})
export class ActivityLogsModule {}
