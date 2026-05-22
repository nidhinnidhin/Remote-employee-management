import { Injectable, Inject } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IListEmployeeLogsUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { ListLogsDto } from '../dto/list-logs.dto';
import { Types } from 'mongoose';

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

    const filter: any = {
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
      if (startStr) filter.date.$gte = startStr;
      if (endStr) filter.date.$lte = endStr;
    }

    return this._attendanceRepository.findPaginatedLogs(filter, page, limit);
  }
}
