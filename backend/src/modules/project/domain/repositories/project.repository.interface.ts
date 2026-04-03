import { ProjectEntity } from '../entities/project.entity';

export interface IProjectRepository {
  create(project: Partial<ProjectEntity>): Promise<ProjectEntity>;
  findById(id: string, companyId: string): Promise<ProjectEntity | null>;
  findAll(companyId: string): Promise<ProjectEntity[]>;
  update(id: string, companyId: string, project: Partial<ProjectEntity>): Promise<ProjectEntity | null>;
  softDelete(id: string, companyId: string): Promise<boolean>;
}
