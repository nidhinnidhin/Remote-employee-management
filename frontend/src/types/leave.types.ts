export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum LeaveDurationType {
  FULL_DAY = 'FULL_DAY',
  FIRST_HALF = 'FIRST_HALF',
  SECOND_HALF = 'SECOND_HALF',
  HOURLY = 'HOURLY',
}

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface EmployeeDetails {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  companyId: string;
  leaveType: string; // Accepts any dynamic policy string
  startDate: string; 
  endDate: string; 
  durationType: LeaveDurationType;
  totalDays: number;
  reason: string;
  attachments: string[];
  emergencyContact: EmergencyContact;
  status: LeaveStatus;
  adminMessage?: string;
  createdAt?: string; 
  updatedAt?: string; 
  employeeDetails?: EmployeeDetails; 
}

export interface LeaveBalance {
  leaveType: string; // Dynamic string key from database policy configurations
  allocated: number;
  consumed: number;
  pending: number;
  available: number;
}

// Client layer flat transport payload
export interface ApplyLeaveDto {
  leaveType: string; // Dynamic plain string
  startDate: string; 
  endDate: string; 
  durationType: LeaveDurationType;
  totalDays: number;
  reason: string;
  attachments?: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
}

// NestJS pipe architecture compatible data structure
export interface BackendApplyLeaveDto {
  leaveType: string; 
  startDate: string;
  endDate: string;
  durationType: LeaveDurationType;
  totalDays: number;
  reason: string;
  attachments: string[];
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface LeaveFilterParams {
  page?: number;
  limit?: number;
  status?: LeaveStatus;
  startDate?: string; 
  endDate?: string; 
}

export interface PaginatedLeaveResponse {
  data: LeaveRequest[];
  total: number;
}