import { ProjectEntity } from '../entities/project.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { ProjectDocument } from '../../infrastructure/database/mongoose/schemas/project.schema'; 

export interface IProjectRepository extends IBaseRepository<ProjectDocument, ProjectEntity> {
  findByIdAndCompany(id: string, companyId: string): Promise<ProjectEntity | null>;
  findAllByCompanyId(companyId: string): Promise<ProjectEntity[]>;
  updateProject(id: string, companyId: string, project: Partial<ProjectEntity>): Promise<ProjectEntity | null>;
  
  softDeleteProject(id: string, companyId: string): Promise<boolean>;
}