import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskEntity } from '../../../domain/entities/task.entity';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskDocument } from '../mongoose/schemas/task.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository'; // Adjust path
import {
  LeanTaskDocument,
  TaskMapper,
} from 'src/modules/project/application/mappers/task.mapper';

@Injectable()
export class MongoTaskRepository
  extends BaseRepository<TaskDocument, TaskEntity>
  implements ITaskRepository
{
  constructor(
    @InjectModel(TaskDocument.name)
    private readonly _taskModel: Model<TaskDocument>,
  ) {
    super(_taskModel);
  }

  protected toEntity(taskDoc: TaskDocument | LeanTaskDocument): TaskEntity {
    return TaskMapper.toDomain(taskDoc);
  }

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const persistenceData = TaskMapper.toPersistence(task);
    return this.save({
      ...persistenceData,
      isDeleted: false,
    } as Partial<TaskDocument>);
  }

  async findByIdAndCompany(
    id: string,
    companyId: string,
  ): Promise<TaskEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return this.findOne({ _id: id, companyId, isDeleted: false });
  }

  async findByStoryId(
    storyId: string,
    companyId: string,
  ): Promise<TaskEntity[]> {
    const docs = await this.model
      .find({ storyId, companyId, isDeleted: false })
      .sort({ order: 1 })
      .lean()
      .exec();

    return docs.map((doc) => this.toEntity(doc as unknown as LeanTaskDocument));
  }

  async findByProjectId(
    projectId: string,
    companyId: string,
  ): Promise<TaskEntity[]> {
    return this.findAll({ projectId, companyId, isDeleted: false });
  }

  async findByAssignee(
    assigneeId: string,
    companyId: string,
  ): Promise<TaskEntity[]> {
    return this.findAll({
      assignedTo: assigneeId,
      companyId,
      isDeleted: false,
    });
  }

  async updateTask(
    id: string,
    companyId: string,
    task: Partial<TaskEntity>,
  ): Promise<TaskEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    // Let TS infer the lean result cleanly
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: task },
        { new: true },
      )
      .lean()
      .exec();

    return doc ? this.toEntity(doc as unknown as LeanTaskDocument) : null;
  }

  async softDeleteTask(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await this.model
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();

    return result.modifiedCount > 0;
  }
}
