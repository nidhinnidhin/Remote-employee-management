import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class RequestBreakDto {
  @IsEnum(['TEA', 'LUNCH', 'EVENING_TEA'])
  @IsNotEmpty()
  breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA';

  @IsString()
  @IsNotEmpty()
  reason: string;
}
