import { IsEmail, IsNotEmpty, IsString, IsOptional, ValidateNested, IsObject, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class OnboardingCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsNotEmpty()
    industry: string;

    @IsOptional()
    @IsString()
    website?: string;
}

export class OnboardingSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    plan: string;
}

export class OnboardingDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => OnboardingCompanyDto)
    company: OnboardingCompanyDto;

    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => OnboardingSubscriptionDto)
    subscription: OnboardingSubscriptionDto;
}
