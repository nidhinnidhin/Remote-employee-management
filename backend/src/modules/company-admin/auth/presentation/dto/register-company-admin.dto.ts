import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyRegistrationDto } from './company-registration.dto';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

class AdminDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @MinLength(8)
  password: string;
}

export class RegisterCompanyAdminDto {
  @ValidateNested()
  @Type(() => CompanyRegistrationDto)
  company: CompanyRegistrationDto;

  @ValidateNested()
  @Type(() => AdminDto)
  admin: AdminDto;
}
