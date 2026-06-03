import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IClockOutUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity, AttendanceActivityEntity } from '../../domain/entities/attendance.entity';

@Injectable()
export class ClockOutUseCase implements IClockOutUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(userId: string, _companyId: string): Promise<AttendanceEntity> {
    const activeShift = await this._attendanceRepository.findActiveShift(userId);
    if (!activeShift) {
      throw new BadRequestException('No active shift found. Please clock in first.');
    }

    if (activeShift.approvalStatus === 'PENDING') {
      throw new BadRequestException('Awaiting administrator approval to start work.');
    }
    if (activeShift.approvalStatus === 'REJECTED') {
      throw new BadRequestException('Your clock-in request has been rejected by the administrator.');
    }

    const now = new Date();
    const activities = [...activeShift.activities];
    let totalBreakMinutes = activeShift.totalBreakMinutes;

    // Handle implicit break end if currently on a break
    if (activeShift.status === 'BREAK') {
      const lastBreakStart = [...activities]
        .reverse()
        .find((act) => act.type === 'BREAK_START');

      if (lastBreakStart) {
        const breakMs = now.getTime() - new Date(lastBreakStart.timestamp).getTime();
        const breakMins = Math.max(0, Math.floor(breakMs / 60000));
        totalBreakMinutes += breakMins;
      }

      activities.push(new AttendanceActivityEntity('BREAK_END', null, now, 'Auto-ended on Clock Out'));
    }

    // Calculate total net work minutes
    const totalElapsedMs = now.getTime() - new Date(activeShift.clockIn).getTime();
    const totalElapsedMins = Math.max(0, Math.floor(totalElapsedMs / 60000));
    const totalWorkMinutes = Math.max(0, totalElapsedMins - totalBreakMinutes);

    activities.push(new AttendanceActivityEntity('CLOCK_OUT', null, now));

    const updatedShift = new AttendanceEntity(
      activeShift.id,
      activeShift.userId,
      activeShift.companyId,
      activeShift.date,
      'COMPLETED',
      activeShift.clockIn,
      now,
      activities,
      totalWorkMinutes,
      totalBreakMinutes,
      activeShift.createdAt,
      now
    );

    // Save and return
    const doc = await this._attendanceRepository.updateById(
      activeShift.id,
      updatedShift as any
    );
    if (!doc) {
      throw new BadRequestException('Failed to complete clock out.');
    }
    return doc;
  }
}
