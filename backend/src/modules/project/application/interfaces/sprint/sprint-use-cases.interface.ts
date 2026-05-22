import { CreateSprintDto } from '../../dto/sprint/create-sprint.dto';
import { UpdateSprintDto } from '../../dto/sprint/update-sprint.dto';
import { SprintEntity } from '../../../domain/entities/sprint.entity';

export interface ICreateSprintUseCase {
  execute(companyId: string, projectId: string, dto: CreateSprintDto): Promise<SprintEntity>;
}

export interface IUpdateSprintUseCase {
  execute(id: string, companyId: string, dto: UpdateSprintDto): Promise<SprintEntity>;
}

export interface IGetSprintUseCase {
  execute(id: string, companyId: string): Promise<SprintEntity>;
}

export interface IListProjectSprintsUseCase {
  execute(projectId: string, companyId: string): Promise<SprintEntity[]>;
}

export interface IDeleteSprintUseCase {
  execute(id: string, companyId: string, hardDelete: boolean): Promise<void>;
}
