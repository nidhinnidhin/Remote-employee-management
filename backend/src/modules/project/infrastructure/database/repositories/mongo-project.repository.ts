import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import { ProjectDocument } from '../mongoose/schemas/project.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { LeanProjectDocument, ProjectMapper } from 'src/modules/project/application/mappers/project.mapper';

@Injectable()
export class MongoProjectRepository 
  extends BaseRepository<ProjectDocument, ProjectEntity> 
  implements IProjectRepository 
{
  constructor(
    @InjectModel(ProjectDocument.name)
    private readonly _projectModel: Model<ProjectDocument>,
  ) {
    super(_projectModel);
  }

  protected toEntity(projectDoc: ProjectDocument | LeanProjectDocument): ProjectEntity {
    return ProjectMapper.toDomain(projectDoc);
  }

  async create(project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const persistenceData = ProjectMapper.toPersistence(project);
    return this.save({
      ...persistenceData,
      isDeleted: false, 
    } as Partial<ProjectDocument>);
  }

  async findByIdAndCompany(id: string, companyId: string): Promise<ProjectEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.findOne({ _id: id, companyId, isDeleted: false });
  }

  async findAllByCompanyId(companyId: string): Promise<ProjectEntity[]> {
    const docs = await this.model
      .find({ companyId, isDeleted: false })
      .lean()
      .exec();
      
    return docs.map((doc) => this.toEntity(doc as unknown as LeanProjectDocument));
  }

  async updateProject(
    id: string,
    companyId: string,
    project: Partial<ProjectEntity>,
  ): Promise<ProjectEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: project },
        { new: true },
      )
      .lean()
      .exec();
      
    return doc ? this.toEntity(doc as unknown as LeanProjectDocument) : null;
  }

  async softDeleteProject(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    
    const result = await this.model
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();
      
    return result.modifiedCount > 0;
  }
}