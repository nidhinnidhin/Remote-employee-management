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
import { DecideLateClockInUseCase } from './application/use-cases/decide-late-clockin.usecase';
import { DecideEarlyOutRequestUseCase } from './application/use-cases/decide-early-out-request.usecase';
import { DecideBreakRequestUseCase } from './application/use-cases/decide-break-request.usecase';
import { RequestEarlyOutUseCase } from './application/use-cases/request-early-out.usecase';
import { RequestBreakUseCase } from './application/use-cases/request-break.usecase';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { EmployeesModule } from '../employees/employees.module';
import { CompanyPolicy, CompanyPolicySchema } from '../company-admin/infrastructure/schema/company-policy.schema';
import { UserDocument, UserSchema } from '../auth/infrastructure/database/mongoose/schemas/userSchema';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    MongooseModule.forFeature([
      { name: AttendanceDocument.name, schema: AttendanceSchema },
      { name: CompanyPolicy.name, schema: CompanyPolicySchema },
      { name: UserDocument.name, schema: UserSchema },
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
    {
      provide: 'IDecideLateClockInUseCase',
      useClass: DecideLateClockInUseCase,
    },
    {
      provide: 'IDecideEarlyOutRequestUseCase',
      useClass: DecideEarlyOutRequestUseCase,
    },
    {
      provide: 'IDecideBreakRequestUseCase',
      useClass: DecideBreakRequestUseCase,
    },
    {
      provide: 'IRequestEarlyOutUseCase',
      useClass: RequestEarlyOutUseCase,
    },
    {
      provide: 'IRequestBreakUseCase',
      useClass: RequestBreakUseCase,
    },
  ],
  exports: [
    'IAttendanceRepository',
  ],
})
export class AttendanceModule {}
