import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IAttendanceRepository } from '../../../domain/repositories/iattendance.repository';
import { AttendanceEntity } from '../../../domain/entities/attendance.entity';
import { AttendanceDocument } from '../mongoose/schemas/attendance.schema';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { AttendanceMapper, LeanAttendanceDocument } from '../../../application/mappers/attendance.mapper';

@Injectable()
export class MongoAttendanceRepository
  extends BaseRepository<AttendanceDocument, AttendanceEntity>
  implements IAttendanceRepository {
  constructor(
    @InjectModel(AttendanceDocument.name)
    private readonly _attendanceModel: Model<AttendanceDocument>,
  ) {
    super(_attendanceModel);
  }

  protected toEntity(doc: AttendanceDocument | LeanAttendanceDocument): AttendanceEntity {
    return AttendanceMapper.toDomain(doc);
  }

  async findByUserAndDate(userId: string, date: string): Promise<AttendanceEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    return this.findOne({ userId: new Types.ObjectId(userId), date });
  }

  async findActiveShift(userId: string): Promise<AttendanceEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    return this.findOne({
      userId: new Types.ObjectId(userId),
      status: { $in: ['WORKING', 'BREAK'] },
    });
  }

  async findPaginatedLogs(
    filter: any,
    page: number,
    limit: number,
  ): Promise<{ data: AttendanceEntity[]; total: number }> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this._attendanceModel
        .find(filter)
        .populate('userId', 'name email')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() as Promise<any[]>,
      this._attendanceModel.countDocuments(filter).exec(),
    ]);

    return {
      data: docs.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  async create(attendance: AttendanceEntity): Promise<AttendanceEntity> {
    const persistenceData = AttendanceMapper.toPersistence(attendance);
    return this.save(persistenceData);
  }
}
