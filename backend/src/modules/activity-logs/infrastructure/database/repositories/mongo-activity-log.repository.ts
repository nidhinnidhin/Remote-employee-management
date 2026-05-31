import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IActivityLogRepository } from '../../../domain/repositories/activity-log.repository.interface';
import {
  ActivityLogEntity,
  ActivityAction,
} from '../../../domain/entities/activity-log.entity';
import { ActivityLog } from '../mongoose/schemas/activity-log.schema';

@Injectable()
export class MongoActivityLogRepository implements IActivityLogRepository {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly _activityLogModel: Model<ActivityLog>,
  ) {}

  private mapToDomain(doc: any): ActivityLogEntity {
    return new ActivityLogEntity(
      doc._id.toString(),
      doc.companyId,
      doc.userId,
      doc.userRole,
      doc.action as ActivityAction,
      doc.details,
      doc.ipAddress,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async create(activityLog: ActivityLogEntity): Promise<ActivityLogEntity> {
    const createdLog = new this._activityLogModel({
      companyId: activityLog.companyId,
      userId: activityLog.userId,
      userRole: activityLog.userRole,
      action: activityLog.action,
      details: activityLog.details,
      ipAddress: activityLog.ipAddress,
    });
    const savedDoc = await createdLog.save();
    return this.mapToDomain(savedDoc);
  }

  async findByEmployeeId(
    employeeId: string,
    companyId: string,
  ): Promise<ActivityLogEntity[]> {
    const logs = await this._activityLogModel
      .find({ userId: employeeId, companyId })
      .sort({ createdAt: -1 })
      .exec();
    return logs.map((log) => this.mapToDomain(log));
  }

  async findByCompanyId(companyId: string): Promise<ActivityLogEntity[]> {
    const logs = await this._activityLogModel
      .find({ companyId })
      .sort({ createdAt: -1 })
      .exec();
    return logs.map((log) => this.mapToDomain(log));
  }

  async findAllForSuperAdmin(): Promise<ActivityLogEntity[]> {
    const logs = await this._activityLogModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return logs.map((log) => this.mapToDomain(log));
  }
}
