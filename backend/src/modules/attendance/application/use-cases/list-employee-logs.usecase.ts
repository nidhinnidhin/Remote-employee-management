import { Injectable, Inject } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IListEmployeeLogsUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { ListLogsDto } from '../dto/list-logs.dto';
import { Types, FilterQuery } from 'mongoose';
import { AttendanceDocument } from '../../infrastructure/database/mongoose/schemas/attendance.schema';

@Injectable()
export class ListEmployeeLogsUseCase implements IListEmployeeLogsUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    userId: string,
    companyId: string,
    dto: ListLogsDto,
  ): Promise<{ data: AttendanceEntity[]; total: number }> {
    const page = dto.page || 1;
    const limit = dto.limit || 5;

    const filter: FilterQuery<AttendanceDocument> = {
      userId: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(companyId),
    };

    if (dto.status && dto.status.trim() !== '') {
      filter.status = dto.status.trim();
    }

    if (dto.search && dto.search.trim() !== '') {
      const searchRegex = new RegExp(dto.search.trim(), 'i');
      filter.$or = [
        { date: searchRegex },
        { status: searchRegex },
        { 'activities.remarks': searchRegex },
      ];
    }

    const startStr = dto.startDate?.trim();
    const endStr = dto.endDate?.trim();
    if (startStr || endStr) {
      filter.date = {};
      if (startStr) (filter.date as Record<string, string>).$gte = startStr;
      if (endStr) (filter.date as Record<string, string>).$lte = endStr;
    }

    return this._attendanceRepository.findPaginatedLogs(filter, page, limit);
  }
}
