import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 1;
  private readonly SALT_ROUNDS = 10;

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async hashOtp(otp: string): Promise<string> {
    return bcrypt.hash(otp, this.SALT_ROUNDS);
  }

  getExpiryDate(): Date {
    return new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
  }
}
