import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
