import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IDecideEarlyOutRequestUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';

@Injectable()
export class DecideEarlyOutRequestUseCase implements IDecideEarlyOutRequestUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
    @Inject('IEmailService')
    private readonly _emailService: IEmailService,
  ) {}

  async execute(
    companyId: string,
    dto: { attendanceId: string; decision: 'APPROVED' | 'REJECTED'; adminRemarks?: string }
  ): Promise<AttendanceEntity> {
    const attendance = await this._attendanceRepository.findById(dto.attendanceId);
    if (!attendance) {
      throw new BadRequestException('Attendance record not found.');
    }

    if (attendance.companyId !== companyId) {
      throw new BadRequestException('Unauthorized to update this attendance record.');
    }

    if (attendance.earlyOutApprovalStatus !== 'PENDING') {
      throw new BadRequestException('This request is not in a pending state.');
    }

    const finalDecision = dto.decision;
    if (!finalDecision || (finalDecision !== 'APPROVED' && finalDecision !== 'REJECTED')) {
      throw new BadRequestException('Invalid decision state.');
    }

    // Create updated attendance entity with decision
    const updatedAttendance = new AttendanceEntity(
      attendance.id,
      attendance.userId,
      attendance.companyId,
      attendance.date,
      attendance.status,
      attendance.clockIn,
      finalDecision === 'APPROVED' ? new Date() : attendance.clockOut,
      attendance.activities,
      attendance.totalWorkMinutes,
      attendance.totalBreakMinutes,
      attendance.createdAt,
      attendance.updatedAt,
      attendance.employeeName,
      attendance.employeeEmail,
      attendance.lateReason,
      attendance.approvalStatus,
      attendance.adminRemarks,
      attendance.earlyOutReason,
      finalDecision,
      dto.adminRemarks || undefined,
      attendance.pendingBreakRequest
    );

    const savedEntity = await this._attendanceRepository.updateById(attendance.id, updatedAttendance as Partial<AttendanceEntity>);
    if (!savedEntity) {
      throw new BadRequestException('Failed to update attendance request.');
    }

    // TODO: Send email to the employee notifying them of the decision

    return savedEntity;
  }
}
