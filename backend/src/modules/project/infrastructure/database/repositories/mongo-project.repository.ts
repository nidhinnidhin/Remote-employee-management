import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectEntity } from '../../../domain/entities/project.entity';
import type { IProjectRepository } from '../../../domain/repositories/project.repository.interface';
import { ProjectDocument } from '../mongoose/schemas/project.schema';
import { ProjectStatus } from 'src/shared/enums/project/project-status.enum';

@Injectable()
export class MongoProjectRepository implements IProjectRepository {
  constructor(
    @InjectModel(ProjectDocument.name)
    private readonly _projectModel: Model<ProjectDocument>,
  ) {}

  private toEntity(doc: ProjectDocument): ProjectEntity {
    return new ProjectEntity(
      (doc._id as Types.ObjectId).toString(),
      doc.companyId,
      doc.name,
      doc.status as ProjectStatus,
      doc.createdBy,
      doc.description,
      doc.startDate,
      doc.endDate,
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }

  async create(project: Partial<ProjectEntity>): Promise<ProjectEntity> {
    const created = new this._projectModel({
      ...project,
      isDeleted: false,
    });
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string, companyId: string): Promise<ProjectEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._projectModel
      .findOne({ _id: id, companyId, isDeleted: false })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findAll(companyId: string): Promise<ProjectEntity[]> {
    const docs = await this._projectModel
      .find({ companyId, isDeleted: false })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(
    id: string,
    companyId: string,
    project: Partial<ProjectEntity>,
  ): Promise<ProjectEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._projectModel
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: project },
        { new: true },
      )
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this._projectModel
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();
    return result.modifiedCount > 0;
  }
}
