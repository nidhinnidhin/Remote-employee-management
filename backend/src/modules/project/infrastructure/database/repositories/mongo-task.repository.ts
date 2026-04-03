import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskEntity } from '../../../domain/entities/task.entity';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskDocument } from '../mongoose/schemas/task.schema';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';

@Injectable()
export class MongoTaskRepository implements ITaskRepository {
  constructor(
    @InjectModel(TaskDocument.name)
    private readonly _taskModel: Model<TaskDocument>,
  ) {}

  private toEntity(doc: TaskDocument): TaskEntity {
    return new TaskEntity(
      (doc._id as Types.ObjectId).toString(),
      doc.companyId,
      doc.projectId?.toString(),
      doc.storyId?.toString(),
      doc.title,
      doc.status as TaskStatus,
      doc.order,
      doc.createdBy,
      doc.description,
      doc.assignedTo?.toString(),
      doc.assignedBy?.toString(),
      doc.estimatedHours,
      doc.actualHours,
      doc.dueDate,
      doc.createdAt,
      doc.updatedAt,
      doc.isDeleted,
    );
  }

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    const created = new this._taskModel({
      ...task,
      isDeleted: false,
    });
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string, companyId: string): Promise<TaskEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._taskModel
      .findOne({ _id: id, companyId, isDeleted: false })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByStoryId(
    storyId: string,
    companyId: string,
  ): Promise<TaskEntity[]> {
    const docs = await this._taskModel
      .find({ storyId, companyId, isDeleted: false })
      .sort({ order: 1 })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByProjectId(
    projectId: string,
    companyId: string,
  ): Promise<TaskEntity[]> {
    const docs = await this._taskModel
      .find({ projectId, companyId, isDeleted: false })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByAssignee(
    assigneeId: string,
    companyId: string,
  ): Promise<TaskEntity[]> {
    const docs = await this._taskModel
      .find({ assignedTo: assigneeId, companyId, isDeleted: false })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async update(
    id: string,
    companyId: string,
    task: Partial<TaskEntity>,
  ): Promise<TaskEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this._taskModel
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: task },
        { new: true },
      )
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async softDelete(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;
    const result = await this._taskModel
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();
    return result.modifiedCount > 0;
  }
}
