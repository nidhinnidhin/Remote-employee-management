import { InviteStatus } from "src/shared/enums/user/user-invite-status.enum";

export class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string,
    public readonly department: string,
    public readonly phone: string,
    public readonly isActive: boolean,
    public readonly hasPassword: boolean,
    public readonly inviteStatus: InviteStatus,
    public readonly companyId?: string,
    public readonly avatar?: string,
  ) { }
}
