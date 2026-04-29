import { UserEntity } from '../../domain/entities/user.entity';
import { EnrichedUserProfile } from 'src/shared/types/profile/enriched-user-profile.type';

export class UserProfileResponseMapper {
  static toEnrichedProfile(
    user: UserEntity,
    departments: string[],
  ): EnrichedUserProfile {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      status: user.status,
      title: user.title,
      companyId: user.companyId,
      inviteStatus: user.inviteStatus,
      hasPassword: user.hasPassword,
      isOnboarded: user.isOnboarded,
      provider: user.provider,

      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      nationality: user.nationality,
      bloodGroup: user.bloodGroup,
      timeZone: user.timeZone,
      bio: user.bio,

      streetAddress: user.streetAddress,
      city: user.city,
      state: user.state,
      country: user.country,
      zipCode: user.zipCode,

      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      emergencyContactRelation: user.emergencyContactRelation,

      linkedInUrl: user.linkedInUrl,
      personalWebsite: user.personalWebsite,
      profileImageUrl: user.profileImageUrl,
      skills: user.skills,
      documents: user.documents,

      departments: departments,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as EnrichedUserProfile;
  }
}
