import { ActivityLogEntity } from '../entities/activity-log.entity';

export interface IActivityLogRepository {
  create(activityLog: ActivityLogEntity): Promise<ActivityLogEntity>; 
  findByEmployeeId(employeeId: string, companyId: string): Promise<ActivityLogEntity[]>;
  findByCompanyId(companyId: string): Promise<ActivityLogEntity[]>;
  findAllForSuperAdmin(): Promise<ActivityLogEntity[]>;
}
