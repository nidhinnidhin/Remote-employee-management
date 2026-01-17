export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly companyId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public revoked: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}

  revoke() {
    this.revoked = true;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
