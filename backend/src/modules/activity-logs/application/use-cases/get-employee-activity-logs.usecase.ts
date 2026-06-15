import { Injectable, Inject } from '@nestjs/common';
import type { IActivityLogRepository } from '../../domain/repositories/activity-log.repository.interface';
import { IGetEmployeeActivityLogsUseCase } from '../interfaces/activity-log-use-cases.interface';
import { ActivityLogEntity } from '../../domain/entities/activity-log.entity';

@Injectable()
export class GetEmployeeActivityLogsUseCase implements IGetEmployeeActivityLogsUseCase {
  constructor(
    @Inject('IActivityLogRepository')
    private readonly _activityLogRepository: IActivityLogRepository,
  ) {}

  async execute(employeeId: string, companyId: string): Promise<ActivityLogEntity[]> {
    return this._activityLogRepository.findByEmployeeId(employeeId, companyId);
  }
}
