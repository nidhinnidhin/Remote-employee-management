import { LeaveRequestDocument } from '../../infrastructure/database/mongoose/schemas/leave-request.schema';
import {
  LeaveRequestEntity,
  EmergencyContact,
  EmployeeDetails,
} from '../../domain/entities/leave-request.entity';

interface PopulatedEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface PopulatedLeaveDocument extends Omit<
  LeaveRequestDocument,
  'employeeId'
> {
  employeeId: PopulatedEmployee | LeaveRequestDocument['employeeId'];
}

export class LeaveRequestMapper {
  static toDomain(
    doc: LeaveRequestDocument | PopulatedLeaveDocument,
  ): LeaveRequestEntity {
    const rawEmployee = doc.employeeId as
      | PopulatedEmployee
      | { toString: () => string };

    const isPopulated =
      rawEmployee &&
      typeof rawEmployee === 'object' &&
      'firstName' in rawEmployee;

    const employeeId = isPopulated
      ? (rawEmployee as PopulatedEmployee)._id.toString()
      : rawEmployee.toString();

    const employeeDetails: EmployeeDetails | undefined = isPopulated
      ? {
          firstName: (rawEmployee as PopulatedEmployee).firstName,
          lastName: (rawEmployee as PopulatedEmployee).lastName,
          email: (rawEmployee as PopulatedEmployee).email,
          avatar: (rawEmployee as PopulatedEmployee).avatar,
        }
      : undefined;

    return new LeaveRequestEntity(
      (
        doc as LeaveRequestDocument & { _id: { toString: () => string } }
      )._id.toString(),
      employeeId,
      doc.companyId.toString(),
      doc.leaveType,
      doc.startDate,
      doc.endDate,
      doc.durationType,
      doc.totalDays,
      doc.reason,
      doc.attachments || [],
      doc.emergencyContact as EmergencyContact,
      doc.status,
      doc.adminMessage,
      (doc as unknown as { createdAt: Date }).createdAt,
      (doc as unknown as { updatedAt: Date }).updatedAt,
      employeeDetails,
    );
  }
}
