import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TaskEntity } from '../../../domain/entities/task.entity';
import type { ITaskRepository } from '../../../domain/repositories/task.repository.interface';
import { TaskDocument } from '../mongoose/schemas/task.schema';
import { TaskStatus } from 'src/shared/enums/project/task-status.enum';
import { BaseRepository } from 'src/shared/repositories/base.repository'; // Adjust path

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

  protected toEntity(taskDoc: any): TaskEntity {
    return new TaskEntity(
      taskDoc._id?.toString() || taskDoc.id,
      taskDoc.companyId,
      taskDoc.projectId?.toString(),
      taskDoc.storyId?.toString(),
      taskDoc.title,
      (taskDoc.status as TaskStatus) || TaskStatus.TODO, 
      taskDoc.order || 0,
      taskDoc.createdBy,
      taskDoc.description || '',
      taskDoc.assignedTo?.toString(),
      taskDoc.assignedBy?.toString(),
      taskDoc.estimatedHours || 0,
      taskDoc.actualHours || 0,
      taskDoc.dueDate,
      taskDoc.createdAt || new Date(),
      taskDoc.updatedAt || new Date(),
      !!taskDoc.isDeleted,
    );
  }

  async create(task: Partial<TaskEntity>): Promise<TaskEntity> {
    return this.save({
      ...task,
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
    const docs = (await this.model
      .find({ storyId, companyId, isDeleted: false })
      .sort({ order: 1 })
      .lean()
      .exec()) as any[];

    return docs.map((doc) => this.toEntity(doc));
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

    // We use the raw model here because the generic updateById doesn't check for companyId
    const doc = (await this.model
      .findOneAndUpdate(
        { _id: id, companyId, isDeleted: false },
        { $set: task },
        { new: true },
      )
      .lean()
      .exec()) as TaskDocument | null;

    return doc ? this.toEntity(doc) : null;
  }

  async softDeleteTask(id: string, companyId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await this.model
      .updateOne({ _id: id, companyId }, { $set: { isDeleted: true } })
      .exec();

    return result.modifiedCount > 0;
  }
}
