import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterAdminDto {
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
