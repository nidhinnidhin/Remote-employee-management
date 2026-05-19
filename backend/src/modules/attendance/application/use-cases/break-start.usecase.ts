import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IBreakStartUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity, AttendanceActivityEntity } from '../../domain/entities/attendance.entity';
import { BreakStartDto } from '../dto/break-start.dto';

@Injectable()
export class BreakStartUseCase implements IBreakStartUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(userId: string, companyId: string, dto: BreakStartDto): Promise<AttendanceEntity> {
    const activeShift = await this._attendanceRepository.findActiveShift(userId);
    if (!activeShift) {
      throw new BadRequestException('No active shift found. You must clock in first.');
    }

    if (activeShift.status === 'BREAK') {
      throw new BadRequestException('You are already on an active break.');
    }

    const now = new Date();
    const activities = [...activeShift.activities];

    // Enforce that we cannot start the same type of break twice today
    const breakTypeLabel = dto.breakType; // TEA, LUNCH, EVENING_TEA
    const alreadyTaken = activities.some(
      (act) => act.type === 'BREAK_START' && act.breakType === breakTypeLabel
    );
    if (alreadyTaken) {
      throw new BadRequestException(`You have already taken your ${breakTypeLabel} break today.`);
    }

    activities.push(new AttendanceActivityEntity(
      'BREAK_START',
      breakTypeLabel,
      now,
      dto.remarks
    ));

    const updatedShift = new AttendanceEntity(
      activeShift.id,
      activeShift.userId,
      activeShift.companyId,
      activeShift.date,
      'BREAK',
      activeShift.clockIn,
      activeShift.clockOut || null,
      activities,
      activeShift.totalWorkMinutes,
      activeShift.totalBreakMinutes,
      activeShift.createdAt,
      now
    );

    const doc = await this._attendanceRepository.updateById(activeShift.id, updatedShift as any);
    if (!doc) {
      throw new BadRequestException('Failed to start break.');
    }
    return doc;
  }
}
