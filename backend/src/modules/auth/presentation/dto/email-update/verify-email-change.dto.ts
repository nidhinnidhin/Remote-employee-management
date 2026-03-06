import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailChangeDto {
  @IsEmail()
  newEmail: string;

  @IsString()
  otp: string;
}