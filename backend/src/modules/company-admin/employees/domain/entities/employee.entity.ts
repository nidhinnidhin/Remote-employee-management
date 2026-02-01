export class Employee {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string,
    public readonly department: string,
    public readonly isActive: boolean,
    public readonly hasPassword: boolean,
    public readonly inviteStatus: 'PENDING' | 'USED',
  ) {}
}
