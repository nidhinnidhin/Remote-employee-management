import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly role: string,
    public readonly phone?: string,
    public readonly passwordHash?: string,
    public readonly status?: UserStatus,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly companyId?: string,
    public readonly department?: string,
    public readonly inviteStatus?: InviteStatus,
    public readonly hasPassword: boolean = true,
    public readonly dateOfBirth?: Date,
    public readonly gender?: string,
    public readonly maritalStatus?: string,
    public readonly nationality?: string,
    public readonly bloodGroup?: string,
    public readonly timeZone?: string,
    public readonly bio?: string,

    public readonly streetAddress?: string,
    public readonly city?: string,
    public readonly state?: string,
    public readonly country?: string,
    public readonly zipCode?: string,

    public readonly emergencyContactName?: string,
    public readonly emergencyContactPhone?: string,
    public readonly emergencyContactRelation?: string,

    public readonly linkedInUrl?: string,
    public readonly personalWebsite?: string,

    public readonly profileImageUrl?: string,
    public readonly profileImagePublicId?: string,

    public readonly skills?: string[],
    public readonly documents?: {
      name: string;
      category: string;
      fileUrl: string;
      publicId: string;
      uploadedAt: Date;
    }[],
  ) {}
}
