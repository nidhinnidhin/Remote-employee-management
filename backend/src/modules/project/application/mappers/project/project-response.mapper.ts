// project-response.mapper.ts

import { ProjectEntity } from '../../../domain/entities/project.entity';
import type { ProjectResponse } from '../../interfaces/project/project-use-cases.interface';

export class ProjectResponseMapper {
  static toResponse(project: ProjectEntity): ProjectResponse {
    return {
      id: project.id,
      companyId: project.companyId,
      name: project.name,
      status: project.status,
      createdBy: project.createdBy,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}