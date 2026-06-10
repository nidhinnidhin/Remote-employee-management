import { Injectable, Inject } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import type { IEmployeeRepository } from 'src/modules/employees/domain/repositories/employee.repository';
import { IListAdminLogsUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { ListLogsDto } from '../dto/list-logs.dto';
import { Types, FilterQuery } from 'mongoose';
import { AttendanceDocument } from '../../infrastructure/database/mongoose/schemas/attendance.schema';

@Injectable()
export class ListAdminLogsUseCase implements IListAdminLogsUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
    @Inject('IEmployeeRepository')
    private readonly _employeeRepository: IEmployeeRepository,
  ) {}

  async execute(
    companyId: string,
    dto: ListLogsDto & { employeeId?: string },
  ): Promise<{ data: AttendanceEntity[]; total: number }> {
    const page = dto.page || 1;
    const limit = dto.limit || 5;

    const filter: FilterQuery<AttendanceDocument> = {
      companyId: new Types.ObjectId(companyId),
    };

    if (dto.status && dto.status.trim() !== '') {
      filter.status = dto.status.trim();
    }

    if (dto.employeeId && Types.ObjectId.isValid(dto.employeeId)) {
      filter.userId = new Types.ObjectId(dto.employeeId);
    } else if (dto.search && dto.search.trim() !== '') {
      const employees = await this._employeeRepository.findAllByCompanyId(companyId, dto.search.trim());
      if (employees.length === 0) {
        return { data: [], total: 0 };
      }
      const employeeIds = employees.map((emp) => new Types.ObjectId(emp.id));
      filter.userId = { $in: employeeIds };
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
