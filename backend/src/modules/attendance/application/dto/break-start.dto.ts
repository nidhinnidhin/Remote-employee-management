import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';

export enum BreakType {
  TEA = 'TEA',
  LUNCH = 'LUNCH',
  EVENING_TEA = 'EVENING_TEA',
}

export class BreakStartDto {
  @IsEnum(BreakType, { message: 'breakType must be either TEA, LUNCH, or EVENING_TEA' })
  breakType: BreakType;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  remarks?: string;
}
