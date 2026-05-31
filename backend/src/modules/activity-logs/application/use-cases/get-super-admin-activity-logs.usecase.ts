import { Injectable, Inject } from '@nestjs/common';
import type { IActivityLogRepository } from '../../domain/repositories/activity-log.repository.interface';
import { IGetSuperAdminActivityLogsUseCase } from '../interfaces/activity-log-use-cases.interface';
import { ActivityLogEntity } from '../../domain/entities/activity-log.entity';

@Injectable()
export class GetSuperAdminActivityLogsUseCase implements IGetSuperAdminActivityLogsUseCase {
  constructor(
    @Inject('IActivityLogRepository')
    private readonly _activityLogRepository: IActivityLogRepository,
  ) {}

  async execute(): Promise<ActivityLogEntity[]> {
    return this._activityLogRepository.findAllForSuperAdmin();
  }
}
