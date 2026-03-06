import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CompanyRegistrationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  size: string;

  @IsString()
  industry: string;

  @IsOptional()
  @IsString()
  website?: string;
}
