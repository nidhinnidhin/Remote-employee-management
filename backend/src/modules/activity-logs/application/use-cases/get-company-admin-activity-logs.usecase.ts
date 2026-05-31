import { Injectable, Inject } from '@nestjs/common';
import type { IActivityLogRepository } from '../../domain/repositories/activity-log.repository.interface';
import { IGetCompanyAdminActivityLogsUseCase } from '../interfaces/activity-log-use-cases.interface';
import { ActivityLogEntity } from '../../domain/entities/activity-log.entity';

@Injectable()
export class GetCompanyAdminActivityLogsUseCase implements IGetCompanyAdminActivityLogsUseCase {
  constructor(
    @Inject('IActivityLogRepository')
    private readonly _activityLogRepository: IActivityLogRepository,
  ) {}

  async execute(companyId: string): Promise<ActivityLogEntity[]> {
    return this._activityLogRepository.findByCompanyId(companyId);
  }
}
