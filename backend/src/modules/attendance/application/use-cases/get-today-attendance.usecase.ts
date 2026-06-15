import { Injectable, Inject } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IGetTodayAttendanceUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';

@Injectable()
export class GetTodayAttendanceUseCase implements IGetTodayAttendanceUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(userId: string, _companyId: string): Promise<AttendanceEntity | null> {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    return this._attendanceRepository.findByUserAndDate(userId, dateStr);
  }
}
