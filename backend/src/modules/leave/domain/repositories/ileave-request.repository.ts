import { LeaveRequestEntity } from '../entities/leave-request.entity';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';

export interface LeaveRequestFilter {
  status?: LeaveStatus;
  search?: string;
  employeeId?: string;
  userIds?: any[]; // For search by name which resolves to an array of ObjectIds
  startDate?: string;
  endDate?: string;
}

export interface ILeaveRequestRepository {
  create(leaveRequest: LeaveRequestEntity): Promise<LeaveRequestEntity>;
  findById(id: string): Promise<LeaveRequestEntity | null>;
  findByEmployeeId(
    employeeId: string,
    page: number,
    limit: number,
    filter?: LeaveRequestFilter
  ): Promise<{ data: LeaveRequestEntity[]; total: number }>;
  findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
    filter?: LeaveRequestFilter
  ): Promise<{ data: LeaveRequestEntity[]; total: number }>;
  findByEmployeeIdAndYear(
    employeeId: string,
    year: number,
    statuses?: LeaveStatus[]
  ): Promise<LeaveRequestEntity[]>;
  updateStatus(
    id: string,
    status: LeaveStatus,
    adminMessage?: string
  ): Promise<LeaveRequestEntity | null>;
}
