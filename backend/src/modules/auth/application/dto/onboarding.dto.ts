import { IsEmail, IsNotEmpty, IsString, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class OnboardingCompanyDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    size!: string;

    @IsString()
    @IsNotEmpty()
    industry!: string;

    @IsOptional()
    @IsString()
    website?: string;
}

export class OnboardingSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    plan!: string;
}

export class OnboardingDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => OnboardingCompanyDto)
    company?: OnboardingCompanyDto;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => OnboardingSubscriptionDto)
    subscription?: OnboardingSubscriptionDto;
}
