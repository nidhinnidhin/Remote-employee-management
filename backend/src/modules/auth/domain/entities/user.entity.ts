import { UserStatus } from '@shared';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly role: string,
    public readonly passwordHash: string,
    public readonly status: UserStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
