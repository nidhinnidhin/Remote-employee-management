import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SprintEntity } from '../../../domain/entities/sprint.entity';
import type { ISprintRepository } from '../../../domain/repositories/sprint.repository.interface';
import { SprintDocument } from '../mongoose/schemas/sprint.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { LeanSprintDocument, SprintMapper } from 'src/modules/project/application/mappers/sprint/sprint.mapper';

@Injectable()
export class MongoSprintRepository
  extends BaseRepository<SprintDocument, SprintEntity>
  implements ISprintRepository
{
  constructor(
    @InjectModel(SprintDocument.name)
    private readonly _sprintModel: Model<SprintDocument>,
  ) {
    super(_sprintModel);
  }

  protected toEntity(
    sprintDocument: SprintDocument | LeanSprintDocument,
  ): SprintEntity {
    return SprintMapper.toDomain(sprintDocument);
  }

  async createSprint(sprint: Partial<SprintEntity>): Promise<SprintEntity> {
    const persistenceData = SprintMapper.toPersistence(sprint);
    return this.save(persistenceData);
  }

  async findByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<SprintEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.findOne({ _id: id, companyId });
  }

  async findByProjectId(
    projectId: string,
    companyId: string,
  ): Promise<SprintEntity[]> {
    if (!Types.ObjectId.isValid(projectId)) return [];
    
    const docs = await this.model
      .find({ 
        projectId: new Types.ObjectId(projectId), 
        companyId 
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return docs.map((doc) =>
      this.toEntity(doc as unknown as LeanSprintDocument),
    );
  }

  async updateSprint(
    id: string,
    companyId: string,
    sprint: Partial<SprintEntity>,
  ): Promise<SprintEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const persistenceData = SprintMapper.toPersistence(sprint);

    const doc = await this.model
      .findOneAndUpdate(
        { _id: id, companyId },
        { $set: persistenceData },
        { new: true },
      )
      .lean()
      .exec();

    return doc ? this.toEntity(doc as unknown as LeanSprintDocument) : null;
  }
}
