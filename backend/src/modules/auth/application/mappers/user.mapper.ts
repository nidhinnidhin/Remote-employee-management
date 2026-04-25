import { Types, FlattenMaps } from 'mongoose';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDocument } from '../../infrastructure/database/mongoose/schemas/userSchema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { PopulatedDepartment } from 'src/shared/types/profile/populated-department.type';

export type LeanUserDocument = FlattenMaps<UserDocument> & {
  _id: Types.ObjectId;
};

export class UserMapper {
  static toDomain(user: UserDocument | LeanUserDocument): UserEntity {
    const departmentValue =
      user.department && typeof user.department === 'object'
        ? (user.department as unknown as PopulatedDepartment).name ||
          (user.department as unknown as PopulatedDepartment)._id?.toString()
        : user.department?.toString();

    return new UserEntity(
      user._id.toString(),
      user.firstName,
      user.lastName,
      user.email,
      user.role,
      user.phone,
      user.passwordHash,
      (user.status as UserStatus) || UserStatus.PENDING_VERIFICATION,
      user.title,
      user.createdAt || new Date(),
      user.updatedAt || new Date(),
      user.companyId,
      departmentValue,
      user.inviteStatus,
      !!user.hasPassword,
      user.dateOfBirth,
      user.gender,
      user.maritalStatus,
      user.nationality,
      user.bloodGroup,
      user.timeZone,
      user.bio,
      user.streetAddress,
      user.city,
      user.state,
      user.country,
      user.zipCode,
      user.emergencyContactName,
      user.emergencyContactPhone,
      user.emergencyContactRelation,
      user.linkedInUrl,
      user.personalWebsite,
      user.profileImageUrl,
      user.profileImagePublicId,
      user.skills || [],
      !!user.isOnboarded,
      user.provider,
      user.providerId,
      user.documents || [],
    );
  }

  static toPersistence(user: UserEntity): Partial<UserDocument> {
    return {
      companyId: user.companyId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      passwordHash: user.passwordHash,
      status: user.status,
      department: user.department,
      inviteStatus: user.inviteStatus,
      hasPassword: user.hasPassword,
      isOnboarded: user.isOnboarded,
      provider: user.provider,
      providerId: user.providerId,
    } as Partial<UserDocument>;
  }
}
