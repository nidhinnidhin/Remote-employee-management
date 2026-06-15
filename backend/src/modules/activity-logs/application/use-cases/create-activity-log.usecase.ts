import { Inject, Injectable } from "@nestjs/common";
import { CreateActivityLogDto, ICreateActivityLogUseCase } from "../interfaces/activity-log-use-cases.interface";
import type { IActivityLogRepository } from "../../domain/repositories/activity-log.repository.interface";
import { ActivityLogEntity } from "../../domain/entities/activity-log.entity";

@Injectable()
export class CreateActivityLogUseCase implements ICreateActivityLogUseCase {
  constructor(
    @Inject('IActivityLogRepository')
    private readonly _activityLogRepository: IActivityLogRepository,
  ) {}

  async execute(dto: CreateActivityLogDto): Promise<ActivityLogEntity> {
    const logEntity = new ActivityLogEntity(
      '', 
      dto.companyId,
      dto.userId,
      dto.userRole,
      dto.action,
      dto.details,
      dto.ipAddress,
    );
    return this._activityLogRepository.create(logEntity);
  }
}