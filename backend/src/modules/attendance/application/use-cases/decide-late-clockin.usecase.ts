import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IDecideLateClockInUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity } from '../../domain/entities/attendance.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import type { IEmailService } from 'src/shared/services/email/interfaces/iemail.service';

@Injectable()
export class DecideLateClockInUseCase implements IDecideLateClockInUseCase {
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

    if (attendance.approvalStatus !== 'PENDING') {
      throw new BadRequestException('This request is not in a pending state.');
    }

    const finalDecision = dto.decision || (dto as any).status;
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
      attendance.clockOut,
      attendance.activities,
      attendance.totalWorkMinutes,
      attendance.totalBreakMinutes,
      attendance.createdAt,
      attendance.updatedAt,
      attendance.employeeName,
      attendance.employeeEmail,
      attendance.lateReason,
      finalDecision,
      dto.adminRemarks || undefined
    );

    const savedEntity = await this._attendanceRepository.updateById(attendance.id, updatedAttendance as any);
    if (!savedEntity) {
      throw new BadRequestException('Failed to update attendance request.');
    }

    // Fetch employee details
    const employee = await this._userModel.findById(attendance.userId).exec();
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Employee';
    const employeeEmail = employee?.email || '';

    // Send email to the employee notifying them of the decision
    if (employeeEmail) {
      try {
        await this._emailService.sendLateClockInDecisionNotification(
          employeeEmail,
          employeeName,
          dto.decision,
          dto.adminRemarks || ''
        );
      } catch (err) {
        console.error('Failed to send employee decision notification email:', err);
      }
    }

    return savedEntity;
  }
}
