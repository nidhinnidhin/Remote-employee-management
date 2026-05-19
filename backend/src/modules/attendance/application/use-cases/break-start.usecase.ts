import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAttendanceRepository } from '../../domain/repositories/iattendance.repository';
import { IBreakStartUseCase } from '../interfaces/attendance-use-cases.interface';
import { AttendanceEntity, AttendanceActivityEntity } from '../../domain/entities/attendance.entity';
import { BreakStartDto } from '../dto/break-start.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyPolicy } from 'src/modules/company-admin/infrastructure/schema/company-policy.schema';

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function getAllowedBreakMinutes(policyDoc: any, targetType: 'TEA' | 'LUNCH' | 'EVENING_TEA'): number {
  const workingHoursPolicy = policyDoc?.policies?.find(p => p.type === 'WORKING_HOURS');
  if (!workingHoursPolicy || !workingHoursPolicy.content) {
    if (targetType === 'TEA') return 15;
    if (targetType === 'LUNCH') return 45;
    return 15;
  }
  
  const content = workingHoursPolicy.content;
  let startStr = '';
  let endStr = '';
  
  if (targetType === 'TEA') {
    startStr = content.morningBreakStart || '';
    endStr = content.morningBreakEnd || '';
  } else if (targetType === 'LUNCH') {
    startStr = content.lunchBreakStart || '';
    endStr = content.lunchBreakEnd || '';
  } else if (targetType === 'EVENING_TEA') {
    startStr = content.eveningBreakStart || '';
    endStr = content.eveningBreakEnd || '';
  }
  
  if (!startStr || !endStr) {
    if (targetType === 'TEA') return 15;
    if (targetType === 'LUNCH') return 45;
    return 15;
  }
  
  const diff = parseTimeToMinutes(endStr) - parseTimeToMinutes(startStr);
  return diff > 0 ? diff : (targetType === 'LUNCH' ? 45 : 15);
}

function getElapsedBreakMinutesForType(activities: any[], targetType: 'TEA' | 'LUNCH' | 'EVENING_TEA'): number {
  let totalMs = 0;
  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    if (act.type === 'BREAK_START' && act.breakType === targetType) {
      const start = new Date(act.timestamp).getTime();
      let end = start;
      
      for (let j = i + 1; j < activities.length; j++) {
        const nextAct = activities[j];
        if (nextAct.type === 'BREAK_END' && nextAct.breakType === targetType) {
          end = new Date(nextAct.timestamp).getTime();
          break;
        }
      }
      
      if (end === start) {
        end = Date.now();
      }
      totalMs += Math.max(0, end - start);
    }
  }
  return totalMs / 1000 / 60;
}

@Injectable()
export class BreakStartUseCase implements IBreakStartUseCase {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly _attendanceRepository: IAttendanceRepository,
    @InjectModel(CompanyPolicy.name)
    private readonly _companyPolicyModel: Model<CompanyPolicy>,
  ) {}

  async execute(userId: string, companyId: string, dto: BreakStartDto): Promise<AttendanceEntity> {
    const activeShift = await this._attendanceRepository.findActiveShift(userId);
    if (!activeShift) {
      throw new BadRequestException('No active shift found. You must clock in first.');
    }

    if (activeShift.approvalStatus === 'PENDING') {
      throw new BadRequestException('Awaiting administrator approval to start work.');
    }
    if (activeShift.approvalStatus === 'REJECTED') {
      throw new BadRequestException('Your clock-in request has been rejected by the administrator.');
    }

    if (activeShift.status === 'BREAK') {
      throw new BadRequestException('You are already on an active break.');
    }

    const now = new Date();
    const activities = [...activeShift.activities];
    const breakTypeLabel = dto.breakType;

    // Fetch dynamic break configuration and calculate current cumulative duration
    const policyDoc = await this._companyPolicyModel.findOne({ companyId }).exec();
    const allowedMinutes = getAllowedBreakMinutes(policyDoc, breakTypeLabel);
    const elapsedMinutes = getElapsedBreakMinutesForType(activities, breakTypeLabel);

    if (elapsedMinutes >= allowedMinutes) {
      throw new BadRequestException(
        `You have exhausted your allowed ${breakTypeLabel === 'TEA' ? 'Tea' : breakTypeLabel === 'LUNCH' ? 'Lunch' : 'Evening Tea'} Break time of ${allowedMinutes} minutes today.`
      );
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
