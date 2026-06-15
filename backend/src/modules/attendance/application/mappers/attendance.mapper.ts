import { Types, FlattenMaps } from 'mongoose';
import { AttendanceEntity, AttendanceActivityEntity } from '../../domain/entities/attendance.entity';
import { AttendanceDocument } from '../../infrastructure/database/mongoose/schemas/attendance.schema';

export type LeanAttendanceDocument = FlattenMaps<AttendanceDocument> & {
  _id: Types.ObjectId;
};

export class AttendanceMapper {
  static toDomain(doc: AttendanceDocument | LeanAttendanceDocument): AttendanceEntity {
    const activities = (doc.activities || []).map(
      (act) => new AttendanceActivityEntity(
        act.type as 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END',
        (act.breakType || null) as 'TEA' | 'LUNCH' | 'EVENING_TEA' | null,
        act.timestamp,
        act.remarks
      ),
    );

    const userRecord = doc.userId as unknown as Record<string, unknown> | null;
    const userIdStr = userRecord
      ? (typeof userRecord === 'object' && userRecord !== null && '_id' in userRecord && userRecord._id
        ? String(userRecord._id)
        : String(doc.userId))
      : '';

    const employeeName = userRecord && typeof userRecord === 'object' && userRecord !== null
      ? ('name' in userRecord
        ? String(userRecord.name)
        : `${userRecord.firstName || ''} ${userRecord.lastName || ''}`.trim())
      : undefined;

    const employeeEmail = userRecord && typeof userRecord === 'object' && userRecord !== null && 'email' in userRecord
      ? String(userRecord.email)
      : undefined;

    const idStr = doc._id ? doc._id.toString() : '';
    const companyIdStr = doc.companyId ? doc.companyId.toString() : '';

    return new AttendanceEntity(
      idStr,
      userIdStr,
      companyIdStr,
      doc.date,
      doc.status as 'WORKING' | 'BREAK' | 'COMPLETED',
      doc.clockIn,
      doc.clockOut || null,
      activities,
      doc.totalWorkMinutes,
      doc.totalBreakMinutes,
      (doc as unknown as { createdAt: Date }).createdAt,
      (doc as unknown as { updatedAt: Date }).updatedAt,
      employeeName,
      employeeEmail,
      (doc as unknown as { lateReason?: string }).lateReason,
      (doc as unknown as { approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' }).approvalStatus || null,
      (doc as unknown as { adminRemarks?: string }).adminRemarks,
    );
  }

  static toPersistence(entity: AttendanceEntity): Partial<AttendanceDocument> {
    return {
      userId: entity.userId,
      companyId: entity.companyId,
      date: entity.date,
      status: entity.status,
      clockIn: entity.clockIn,
      clockOut: entity.clockOut || undefined,
      activities: entity.activities.map((act) => ({
        type: act.type,
        breakType: act.breakType || undefined,
        timestamp: act.timestamp,
        remarks: act.remarks,
      })),
      totalWorkMinutes: entity.totalWorkMinutes,
      totalBreakMinutes: entity.totalBreakMinutes,
      lateReason: entity.lateReason || undefined,
      approvalStatus: entity.approvalStatus || undefined,
      adminRemarks: entity.adminRemarks || undefined,
    } as Partial<AttendanceDocument>;
  }
}
