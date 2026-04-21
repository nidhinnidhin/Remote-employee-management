import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CarryOverType } from 'src/shared/enums/company-policy/carry-over-type.enum';

class CarryOverDto {
  @IsString()
  type: CarryOverType;

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
