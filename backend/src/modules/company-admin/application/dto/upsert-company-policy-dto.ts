import { IsArray, ValidateNested, IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PolicySectionDto {
  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  points: string[];
}

class PolicyContentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicySectionDto)
  sections: PolicySectionDto[];

  @IsString()
  @IsOptional()
  workStartTime?: string;

  @IsString()
  @IsOptional()
  workEndTime?: string;

  @IsString()
  @IsOptional()
  morningBreakStart?: string;

  @IsString()
  @IsOptional()
  morningBreakEnd?: string;

  @IsString()
  @IsOptional()
  lunchBreakStart?: string;

  @IsString()
  @IsOptional()
  lunchBreakEnd?: string;

  @IsString()
  @IsOptional()
  eveningBreakStart?: string;

  @IsString()
  @IsOptional()
  eveningBreakEnd?: string;
}

class LeaveDistributionDto {
  @IsString()
  type: string;

  @IsNumber()
  days: number;
}

export class PolicyDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => PolicyContentDto)
  content: PolicyContentDto;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LeaveDistributionDto)
  leaveDistribution?: LeaveDistributionDto[];
}

export class UpsertCompanyPoliciesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyDto)
  policies: PolicyDto[];
}
