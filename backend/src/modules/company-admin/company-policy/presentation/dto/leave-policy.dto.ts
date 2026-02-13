import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsString, Max, Min, ValidateNested } from "class-validator";

class CarryOverDto {
  @IsString()
  type: 'FULL' | 'PARTIAL' | 'NONE';

  @IsInt()
  @Min(0)
  @Max(100)
  percentage: number;
}

class LeaveConfigurationDto {
  @IsInt()
  annualLeaveDays: number;

  @IsInt()
  sickLeaveDays: number;

  @IsInt()
  casualLeaveDays: number;

  @IsInt()
  maternityLeaveDays: number;

  @ValidateNested()
  @Type(() => CarryOverDto)
  carryoverPolicy: CarryOverDto;

  @IsBoolean()
  requireManagerApproval: boolean;

  @IsInt()
  minimumNoticePeriodDays: number;
}

export class LeavePolicyContentDto {
  @ValidateNested()
  @Type(() => LeaveConfigurationDto)
  configuration: LeaveConfigurationDto;
}
