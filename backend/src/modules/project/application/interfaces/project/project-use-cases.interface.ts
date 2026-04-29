// project-use-cases.interface.ts

import { CreateProjectDto } from '../../dto/project/create-project.dto';
import { UpdateProjectDto } from '../../dto/project/update-project.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';

// 👇 1. Define the clean response type (omits 'isDeleted')
export type ProjectResponse = Omit<ProjectEntity, 'isDeleted'>;

export interface ICreateProjectUseCase {
  // 👇 2. Change return types from ProjectEntity to ProjectResponse
  execute(companyId: string, adminId: string, dto: CreateProjectDto): Promise<ProjectResponse>;
}

export interface IGetProjectUseCase {
  execute(id: string, companyId: string): Promise<ProjectResponse>;
}

export interface IListProjectsUseCase {
  execute(companyId: string): Promise<ProjectResponse[]>;
}

export interface IUpdateProjectUseCase {
  execute(id: string, companyId: string, dto: UpdateProjectDto): Promise<ProjectResponse>;
}

export interface IDeleteProjectUseCase {
  execute(id: string, companyId: string): Promise<boolean>;
}