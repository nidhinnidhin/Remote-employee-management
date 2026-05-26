import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import {
  ILeaveRequestRepository,
  LeaveRequestFilter,
} from '../../../domain/repositories/ileave-request.repository';
import { LeaveRequestEntity } from '../../../domain/entities/leave-request.entity';
import {
  LeaveRequest,
  LeaveRequestDocument,
} from '../mongoose/schemas/leave-request.schema';
import { LeaveRequestMapper } from '../../../application/mappers/leave-request.mapper';
import { LeaveStatus } from 'src/shared/enums/leave/leave-status.enum';

@Injectable()
export class MongoLeaveRequestRepository implements ILeaveRequestRepository {
  constructor(
    @InjectModel(LeaveRequest.name)
    private readonly _leaveRequestModel: Model<LeaveRequestDocument>,
  ) {}

  async create(leaveRequest: LeaveRequestEntity): Promise<LeaveRequestEntity> {
    const created = await this._leaveRequestModel.create({
      employeeId: new Types.ObjectId(leaveRequest.employeeId),
      companyId: new Types.ObjectId(leaveRequest.companyId),
      leaveType: leaveRequest.leaveType,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      durationType: leaveRequest.durationType,
      totalDays: leaveRequest.totalDays,
      reason: leaveRequest.reason,
      attachments: leaveRequest.attachments,
      emergencyContact: leaveRequest.emergencyContact,
      status: leaveRequest.status,
      adminMessage: leaveRequest.adminMessage,
    });
    return LeaveRequestMapper.toDomain(created);
  }

  async findById(id: string): Promise<LeaveRequestEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const found = await this._leaveRequestModel
      .findById(id)
      .populate('employeeId', 'firstName lastName email avatar');
    return found ? LeaveRequestMapper.toDomain(found) : null;
  }

  async findByEmployeeId(
    employeeId: string,
    page: number,
    limit: number,
    filter?: LeaveRequestFilter,
  ): Promise<{ data: LeaveRequestEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<LeaveRequestDocument> = {
      employeeId: new Types.ObjectId(employeeId),
    };

    if (filter?.status) query.status = filter.status;

    if (filter?.startDate && filter?.endDate) {
      query.startDate = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate),
      };
    } else if (filter?.startDate) {
      query.startDate = { $gte: new Date(filter.startDate) };
    } else if (filter?.endDate) {
      query.startDate = { $lte: new Date(filter.endDate) };
    }

    const [data, total] = await Promise.all([
      this._leaveRequestModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._leaveRequestModel.countDocuments(query),
    ]);

    return { data: data.map(LeaveRequestMapper.toDomain), total };
  }

  async findByCompanyId(
    companyId: string,
    page: number,
    limit: number,
    filter?: LeaveRequestFilter,
  ): Promise<{ data: LeaveRequestEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: FilterQuery<LeaveRequestDocument> = {
      companyId: new Types.ObjectId(companyId),
    };

    if (filter?.status) query.status = filter.status;

    if (filter?.startDate && filter?.endDate) {
      query.startDate = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate),
      };
    } else if (filter?.startDate) {
      query.startDate = { $gte: new Date(filter.startDate) };
    } else if (filter?.endDate) {
      query.startDate = { $lte: new Date(filter.endDate) };
    }

    // For admin side, we populate employee details
    const [data, total] = await Promise.all([
      this._leaveRequestModel
        .find(query)
        .populate('employeeId', 'firstName lastName email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._leaveRequestModel.countDocuments(query),
    ]);

    return { data: data.map(LeaveRequestMapper.toDomain), total };
  }

  async findByEmployeeIdAndYear(
    employeeId: string,
    year: number,
    statuses?: LeaveStatus[],
  ): Promise<LeaveRequestEntity[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    const query: FilterQuery<LeaveRequestDocument> = {
      employeeId: new Types.ObjectId(employeeId),
      startDate: { $gte: startDate, $lte: endDate },
    };

    if (statuses && statuses.length > 0) {
      query.status = { $in: statuses };
    }

    const data = await this._leaveRequestModel.find(query);
    return data.map(LeaveRequestMapper.toDomain);
  }

  async updateStatus(
    id: string,
    status: LeaveStatus,
    adminMessage?: string,
  ): Promise<LeaveRequestEntity | null> {
    const updated = await this._leaveRequestModel
      .findByIdAndUpdate(
        id,
        { status, ...(adminMessage !== undefined && { adminMessage }) },
        { new: true },
      )
      .populate('employeeId', 'firstName lastName email avatar');

    return updated ? LeaveRequestMapper.toDomain(updated) : null;
  }
}
