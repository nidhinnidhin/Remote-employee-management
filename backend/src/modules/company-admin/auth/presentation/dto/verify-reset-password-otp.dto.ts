import { IsEmail, IsString } from 'class-validator';

export class VerifyResetPasswordOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
