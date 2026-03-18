export interface IOtpService {
  generateOtp(): string;
  hashOtp(otp: string): Promise<string>;
  getExpiryDate(): Date;
}
