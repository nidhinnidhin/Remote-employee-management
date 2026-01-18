export class SuperAdmin {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly isActive: boolean,
  ) {}

  canLogin(): boolean {
    return this.isActive;
  }
}
