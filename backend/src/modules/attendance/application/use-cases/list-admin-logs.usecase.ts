import { Injectable, Inject } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IListAdminLogsUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { ListLogsDto } from '../dto/list-logs.dto';
import { Types } from 'mongoose';

@Injectable()
export class ListAdminLogsUseCase implements IListAdminLogsUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    companyId: string,
    dto: ListLogsDto & { employeeId?: string },
  ): Promise<{ data: AttendanceEntity[]; total: number }> {
    const page = dto.page || 1;
    const limit = dto.limit || 10;

    const filter: any = {
      companyId: new Types.ObjectId(companyId),
    };

    if (dto.employeeId && Types.ObjectId.isValid(dto.employeeId)) {
      filter.userId = new Types.ObjectId(dto.employeeId);
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
