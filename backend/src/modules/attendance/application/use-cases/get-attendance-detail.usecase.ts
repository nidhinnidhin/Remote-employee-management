import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IGetAttendanceDetailUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';

@Injectable()
export class GetAttendanceDetailUseCase implements IGetAttendanceDetailUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(id: string, companyId: string): Promise<AttendanceEntity> {
    const log = await this._attendanceRepository.findById(id);
    if (!log) {
      throw new NotFoundException('Attendance log not found.');
    }

    // Security check: Ensure record belongs to the user's company
    if (log.companyId !== companyId) {
      throw new ForbiddenException('Access denied. You do not have permission to view this log.');
    }

    return log;
  }
}
