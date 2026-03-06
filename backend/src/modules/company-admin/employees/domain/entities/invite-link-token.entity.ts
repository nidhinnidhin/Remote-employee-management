export class InviteLinkToken {
  constructor(
    public readonly token: string, 
    public readonly employeeId: string,
    public readonly expiresAt: Date,
    public used: boolean,
  ) {}
}