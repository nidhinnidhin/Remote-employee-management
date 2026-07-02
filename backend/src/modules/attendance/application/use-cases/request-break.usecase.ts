import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IRequestBreakUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { RequestBreakDto } from '../dto/request-break.dto';

@Injectable()
export class RequestBreakUseCase implements IRequestBreakUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(userId: string, companyId: string, dto: RequestBreakDto): Promise<AttendanceEntity> {
    const activeShift = await this._attendanceRepository.findActiveShift(userId);
    if (!activeShift) {
      throw new BadRequestException('No active shift found. You must be clocked in.');
    }

    if (activeShift.pendingBreakRequest?.status === 'PENDING') {
      throw new BadRequestException('You already have a pending break request.');
    }

    const updatedShift = new AttendanceEntity(
      activeShift.id,
      activeShift.userId,
      activeShift.companyId,
      activeShift.date,
      activeShift.status,
      activeShift.clockIn,
      activeShift.clockOut,
      activeShift.activities,
      activeShift.totalWorkMinutes,
      activeShift.totalBreakMinutes,
      activeShift.createdAt,
      new Date(),
      activeShift.employeeName,
      activeShift.employeeEmail,
      activeShift.lateReason,
      activeShift.approvalStatus,
      activeShift.adminRemarks,
      activeShift.earlyOutReason,
      activeShift.earlyOutApprovalStatus,
      activeShift.earlyOutAdminRemarks,
      {
        breakType: dto.breakType,
        reason: dto.reason,
        status: 'PENDING'
      }
    );

    const doc = await this._attendanceRepository.updateById(activeShift.id, updatedShift as Partial<AttendanceEntity>);
    if (!doc) {
      throw new BadRequestException('Failed to submit break request.');
    }

    // TODO: Send email to admin

    return doc;
  }
}
