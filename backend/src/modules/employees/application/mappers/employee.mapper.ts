import { Types, FlattenMaps } from 'mongoose';
import { Employee } from '../../domain/entities/employee.entity';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

// Strict type for leaned documents to avoid using 'any'
export type LeanUserDocument = FlattenMaps<UserDocument> & {
  _id: Types.ObjectId;
};

export class EmployeeMapper {
  static toDomain(userDoc: UserDocument | LeanUserDocument): Employee {
    return new Employee(
      userDoc._id.toString(),
      `${userDoc.firstName || ''} ${userDoc.lastName || ''}`.trim(),
      userDoc.email,
      userDoc.role,
      userDoc.department?.toString() || '',
      userDoc.phone || '',
      userDoc.status === UserStatus.ACTIVE,
      !!userDoc.hasPassword,
      (userDoc.inviteStatus as InviteStatus) || InviteStatus.PENDING,
      userDoc.companyId,
      userDoc.profileImageUrl,
    );
  }

  static toPersistenceCreate(input: {
    name: string;
    email: string;
    role: string;
    department?: string;
    phone?: string;
    companyId: string;
    isActive: boolean;
    hasPassword: boolean;
    inviteStatus: InviteStatus;
    isOnboarded: boolean;
  }): Partial<UserDocument> {
    const [firstName, ...rest] = input.name.split(' ');
    const lastName = rest.join(' ') || '';

    return {
      companyId: input.companyId || undefined,
      firstName,
      lastName: lastName || undefined,
      email: input.email.toLowerCase(),
      phone: input.phone || '',
      role: input.role,
      status: UserStatus.PENDING_VERIFICATION,
      department: input.department || undefined,
      inviteStatus: input.inviteStatus || InviteStatus.PENDING,
      hasPassword: !!input.hasPassword,
      isOnboarded: input.isOnboarded,
    } as Partial<UserDocument>;
  }
}
