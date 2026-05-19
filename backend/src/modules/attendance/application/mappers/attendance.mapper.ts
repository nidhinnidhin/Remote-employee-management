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

    const userIdStr = doc.userId
      ? (typeof doc.userId === 'object' && doc.userId !== null && '_id' in doc.userId && (doc.userId as any)._id
        ? (doc.userId as any)._id.toString()
        : doc.userId.toString())
      : '';

    const employeeName = doc.userId && typeof doc.userId === 'object' && doc.userId !== null
      ? ('name' in doc.userId
        ? (doc.userId as any).name
        : `${(doc.userId as any).firstName || ''} ${(doc.userId as any).lastName || ''}`.trim())
      : undefined;

    const employeeEmail = doc.userId && typeof doc.userId === 'object' && doc.userId !== null && 'email' in doc.userId
      ? (doc.userId as any).email
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
      (doc as any).createdAt,
      (doc as any).updatedAt,
      employeeName,
      employeeEmail,
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
    } as Partial<AttendanceDocument>;
  }
}
