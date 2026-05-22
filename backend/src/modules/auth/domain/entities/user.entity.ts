import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly role: string,
    public readonly phone?: string | null,
    public readonly passwordHash?: string,
    public readonly status?: UserStatus,
    public readonly title?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly companyId?: string,
    public readonly department?: string | null,
    public readonly inviteStatus?: InviteStatus,
    public readonly hasPassword: boolean = true,
    public readonly dateOfBirth?: Date | null,
    public readonly gender?: string | null,
    public readonly maritalStatus?: string | null,
    public readonly nationality?: string | null,
    public readonly bloodGroup?: string | null,
    public readonly timeZone?: string | null,
    public readonly bio?: string | null,

    public readonly streetAddress?: string | null,
    public readonly city?: string | null,
    public readonly state?: string | null,
    public readonly country?: string | null,
    public readonly zipCode?: string | null,

    public readonly emergencyContactName?: string | null,
    public readonly emergencyContactPhone?: string | null,
    public readonly emergencyContactRelation?: string | null,

    public readonly linkedInUrl?: string | null,
    public readonly personalWebsite?: string | null,

    public readonly profileImageUrl?: string,
    public readonly profileImagePublicId?: string,

    public readonly skills?: string[],
    public readonly isOnboarded: boolean = false,
    public readonly provider?: string,
    public readonly providerId?: string,
    public readonly documents?: {
      name: string;
      category: string;
      fileUrl: string;
      publicId: string;
      resourceType: string;
      uploadedAt: Date;
    }[],
  ) {}
}
