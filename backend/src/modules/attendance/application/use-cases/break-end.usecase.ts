import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IBreakEndUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity, AttendanceActivityEntity } from '../../domain/entities/attendance.entity';

@Injectable()
export class BreakEndUseCase implements IBreakEndUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(userId: string, companyId: string): Promise<AttendanceEntity> {
    const activeShift = await this._attendanceRepository.findActiveShift(userId);
    if (!activeShift || activeShift.status !== 'BREAK') {
      throw new BadRequestException('No active break found. You must start a break first.');
    }

    if (activeShift.approvalStatus === 'PENDING') {
      throw new BadRequestException('Awaiting administrator approval to start work.');
    }
    if (activeShift.approvalStatus === 'REJECTED') {
      throw new BadRequestException('Your clock-in request has been rejected by the administrator.');
    }

    const now = new Date();
    const activities = [...activeShift.activities];

    // Find the latest active break start log
    const lastBreakStartIndex = [...activities]
      .reverse()
      .findIndex((act) => act.type === 'BREAK_START');

    let breakDurationMins = 0;
    let breakTypeLabel: any = null;

    if (lastBreakStartIndex !== -1) {
      // Because we reversed it, the real index from start is:
      const realIndex = activities.length - 1 - lastBreakStartIndex;
      const lastBreakStart = activities[realIndex];
      const breakMs = now.getTime() - new Date(lastBreakStart.timestamp).getTime();
      breakDurationMins = Math.max(0, Math.floor(breakMs / 60000));
      breakTypeLabel = lastBreakStart.breakType;
    }

    activities.push(new AttendanceActivityEntity(
      'BREAK_END',
      breakTypeLabel,
      now,
      `Completed break - duration: ${breakDurationMins} mins`
    ));

    const totalBreakMinutes = activeShift.totalBreakMinutes + breakDurationMins;

    const updatedShift = new AttendanceEntity(
      activeShift.id,
      activeShift.userId,
      activeShift.companyId,
      activeShift.date,
      'WORKING',
      activeShift.clockIn,
      activeShift.clockOut || null,
      activities,
      activeShift.totalWorkMinutes,
      totalBreakMinutes,
      activeShift.createdAt,
      now
    );

    const doc = await this._attendanceRepository.updateById(activeShift.id, updatedShift as any);
    if (!doc) {
      throw new BadRequestException('Failed to end break.');
    }
    return doc;
  }
}
