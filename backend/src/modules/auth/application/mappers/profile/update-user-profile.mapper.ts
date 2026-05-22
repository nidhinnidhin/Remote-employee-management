import { UpdateProfileDto } from '../../dto/update-profile.dto';

export class UpdateUserProfileMapper {
  static toPersistence(dto: UpdateProfileDto): Record<string, any> {
    const rawUpdate: Record<string, any> = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : dto.dateOfBirth,
      gender: dto.gender,
      maritalStatus: dto.maritalStatus,
      nationality: dto.nationality,
      bloodGroup: dto.bloodGroup,
      timeZone: dto.timeZone,
      bio: dto.bio,
      streetAddress: dto.streetAddress,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      zipCode: dto.zipCode,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      emergencyContactRelation: dto.emergencyContactRelation,
      linkedInUrl: dto.linkedInUrl,
      personalWebsite: dto.personalWebsite,
    };

    const cleanedUpdate = Object.fromEntries(
      Object.entries(rawUpdate).filter(([_, value]) => value !== undefined),
    );

    return cleanedUpdate;
  }
}