import {
  ActivityAction,
  ActivityLogEntity,
} from '../../domain/entities/activity-log.entity';

export interface IGetEmployeeActivityLogsUseCase {
  execute(employeeId: string, companyId: string): Promise<ActivityLogEntity[]>;
}

export interface IGetCompanyAdminActivityLogsUseCase {
  execute(companyId: string): Promise<ActivityLogEntity[]>;
}

export interface IGetSuperAdminActivityLogsUseCase {
  execute(): Promise<ActivityLogEntity[]>;
}

export interface CreateActivityLogDto {
  companyId: string | null;
  userId: string;
  userRole: string;
  action: ActivityAction;
  details: string;
  ipAddress?: string;
}

export interface ICreateActivityLogUseCase {
  execute(dto: CreateActivityLogDto): Promise<ActivityLogEntity>;
}
