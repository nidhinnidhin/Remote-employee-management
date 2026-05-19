import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/presentation/auth/auth.module';
import { AttendanceDocument, AttendanceSchema } from './infrastructure/database/mongoose/schemas/attendance.schema';
import { MongoAttendanceRepository } from './infrastructure/database/repositories/mongo-attendance.repository';
import { ClockInUseCase } from './application/use-cases/clock-in.usecase';
import { ClockOutUseCase } from './application/use-cases/clock-out.usecase';
import { BreakStartUseCase } from './application/use-cases/break-start.usecase';
import { BreakEndUseCase } from './application/use-cases/break-end.usecase';
import { GetTodayAttendanceUseCase } from './application/use-cases/get-today-attendance.usecase';
import { ListEmployeeLogsUseCase } from './application/use-cases/list-employee-logs.usecase';
import { ListAdminLogsUseCase } from './application/use-cases/list-admin-logs.usecase';
import { GetAttendanceDetailUseCase } from './application/use-cases/get-attendance-detail.usecase';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    MongooseModule.forFeature([
      { name: AttendanceDocument.name, schema: AttendanceSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [
    {
      provide: 'IAttendanceRepository',
      useClass: MongoAttendanceRepository,
    },
    {
      provide: 'IClockInUseCase',
      useClass: ClockInUseCase,
    },
    {
      provide: 'IClockOutUseCase',
      useClass: ClockOutUseCase,
    },
    {
      provide: 'IBreakStartUseCase',
      useClass: BreakStartUseCase,
    },
    {
      provide: 'IBreakEndUseCase',
      useClass: BreakEndUseCase,
    },
    {
      provide: 'IGetTodayAttendanceUseCase',
      useClass: GetTodayAttendanceUseCase,
    },
    {
      provide: 'IListEmployeeLogsUseCase',
      useClass: ListEmployeeLogsUseCase,
    },
    {
      provide: 'IListAdminLogsUseCase',
      useClass: ListAdminLogsUseCase,
    },
    {
      provide: 'IGetAttendanceDetailUseCase',
      useClass: GetAttendanceDetailUseCase,
    },
  ],
  exports: [
    'IAttendanceRepository',
  ],
})
export class AttendanceModule {}
