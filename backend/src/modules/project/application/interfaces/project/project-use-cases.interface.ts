import { CreateProjectDto } from '../../dto/project/create-project.dto';
import { UpdateProjectDto } from '../../dto/project/update-project.dto';
import { SearchProjectsDto } from '../../dto/project/search-projects.dto';
import { ProjectEntity } from '../../../domain/entities/project.entity';

export interface ICreateProjectUseCase {
  execute(companyId: string, adminId: string, dto: CreateProjectDto): Promise<ProjectEntity>;
}

export interface IGetProjectUseCase {
  execute(id: string, companyId: string): Promise<ProjectEntity>;
}

export interface IListProjectsUseCase {
  execute(companyId: string): Promise<ProjectEntity[]>;
}

export interface ISearchProjectsUseCase {
  execute(companyId: string, dto: SearchProjectsDto): Promise<{
    data: ProjectEntity[];
    total: number;
    page: number;
    limit: number;
  }>;
}

export interface IUpdateProjectUseCase {
  execute(id: string, companyId: string, dto: UpdateProjectDto): Promise<ProjectEntity>;
}

export interface IDeleteProjectUseCase {
  execute(id: string, companyId: string): Promise<boolean>;
}
