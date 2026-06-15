import { ApplyLeaveDto } from '../dto/apply-leave.dto';
import { LeaveRequestEntity } from '../../domain/entities/leave-request.entity';
import { LeaveRequestFilter } from '../../domain/repositories/ileave-request.repository';

export interface LeaveBalance {
  leaveType: string;
  allocated: number;
  consumed: number;
  pending: number;
  available: number;
}

export interface IApplyLeaveUseCase {
  execute(companyId: string, employeeId: string, dto: ApplyLeaveDto): Promise<LeaveRequestEntity>;
}

export interface IApproveLeaveUseCase {
  execute(id: string, adminMessage?: string): Promise<LeaveRequestEntity>;
}

export interface ICancelLeaveUseCase {
  execute(id: string, requestingEmployeeId: string): Promise<LeaveRequestEntity>;
}

export interface IGetCompanyLeavesUseCase {
  execute(companyId: string, page?: number, limit?: number, filter?: LeaveRequestFilter): Promise<{ data: LeaveRequestEntity[]; total: number }>;
}

export interface IGetEmployeeLeavesUseCase {
  execute(employeeId: string, page?: number, limit?: number, filter?: LeaveRequestFilter): Promise<{ data: LeaveRequestEntity[]; total: number }>;
}

export interface IGetLeaveBalanceUseCase {
  execute(companyId: string, employeeId: string): Promise<LeaveBalance[]>;
}

export interface IGetLeaveByIdUseCase {
  execute(id: string): Promise<LeaveRequestEntity>;
}

export interface IRejectLeaveUseCase {
  execute(id: string, adminMessage?: string): Promise<LeaveRequestEntity>;
}
