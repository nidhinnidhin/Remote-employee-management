import { SprintEntity } from '../entities/sprint.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { SprintDocument } from '../../infrastructure/database/mongoose/schemas/sprint.schema';

export interface ISprintRepository extends IBaseRepository<SprintDocument, SprintEntity> {
  findByIdAndCompany(id: string, companyId: string): Promise<SprintEntity | null>;
  findByProjectId(projectId: string, companyId: string): Promise<SprintEntity[]>;
  createSprint(sprint: Partial<SprintEntity>): Promise<SprintEntity>;
  updateSprint(id: string, companyId: string, sprint: Partial<SprintEntity>): Promise<SprintEntity | null>;
}
