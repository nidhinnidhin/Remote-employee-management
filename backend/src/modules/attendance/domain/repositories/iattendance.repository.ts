import { AttendanceEntity } from '../entities/attendance.entity';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import type { AttendanceDocument } from '../../infrastructure/database/mongoose/schemas/attendance.schema';

export interface IAttendanceRepository extends IBaseRepository<AttendanceDocument, AttendanceEntity> {
  findByUserAndDate(userId: string, date: string): Promise<AttendanceEntity | null>;
  findActiveShift(userId: string): Promise<AttendanceEntity | null>;
  findPaginatedLogs(
    filter: any,
    page: number,
    limit: number,
  ): Promise<{ data: AttendanceEntity[]; total: number }>;
  create(attendance: AttendanceEntity): Promise<AttendanceEntity>;
}
