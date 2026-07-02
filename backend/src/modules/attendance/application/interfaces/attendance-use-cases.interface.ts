import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { ClockInDto } from '../dto/clock-in.dto';
import { BreakStartDto } from '../dto/break-start.dto';
import { ListLogsDto } from '../dto/list-logs.dto';
import { RequestEarlyOutDto } from '../dto/request-early-out.dto';
import { RequestBreakDto } from '../dto/request-break.dto';

export interface IClockInUseCase {
  execute(userId: string, companyId: string, dto: ClockInDto): Promise<AttendanceEntity>;
}

export interface IClockOutUseCase {
  execute(userId: string, companyId: string): Promise<AttendanceEntity>;
}

export interface IBreakStartUseCase {
  execute(userId: string, companyId: string, dto: BreakStartDto): Promise<AttendanceEntity>;
}

export interface IBreakEndUseCase {
  execute(userId: string, companyId: string): Promise<AttendanceEntity>;
}

export interface IGetTodayAttendanceUseCase {
  execute(userId: string, companyId: string): Promise<AttendanceEntity | null>;
}

export interface IListEmployeeLogsUseCase {
  execute(userId: string, companyId: string, dto: ListLogsDto): Promise<{ data: AttendanceEntity[]; total: number }>;
}

export interface IListAdminLogsUseCase {
  execute(companyId: string, dto: ListLogsDto & { employeeId?: string }): Promise<{ data: AttendanceEntity[]; total: number }>;
}

export interface IGetAttendanceDetailUseCase {
  execute(id: string, companyId: string): Promise<AttendanceEntity>;
}

export interface IDecideLateClockInUseCase {
  execute(
    companyId: string,
    dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ): Promise<AttendanceEntity>;
}

export interface IDecideEarlyOutRequestUseCase {
  execute(
    companyId: string,
    dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ): Promise<AttendanceEntity>;
}

export interface IDecideBreakRequestUseCase {
  execute(
    companyId: string,
    dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ): Promise<AttendanceEntity>;
}

export interface IRequestEarlyOutUseCase {
  execute(userId: string, companyId: string, dto: RequestEarlyOutDto): Promise<AttendanceEntity>;
}

export interface IRequestBreakUseCase {
  execute(userId: string, companyId: string, dto: RequestBreakDto): Promise<AttendanceEntity>;
}

export interface IDecideEarlyOutUseCase {
  execute(
    companyId: string,
    dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ): Promise<AttendanceEntity>;
}

export interface IDecideBreakUseCase {
  execute(
    companyId: string,
    dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ): Promise<AttendanceEntity>;
}
