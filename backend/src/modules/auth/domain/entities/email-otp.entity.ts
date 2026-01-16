export class EmailOtpEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly email: string,
    public readonly otpHash: string,
    public readonly expiresAt: Date,
    public readonly verified: boolean,
    public readonly createdAt: Date,
  ) {}
}
