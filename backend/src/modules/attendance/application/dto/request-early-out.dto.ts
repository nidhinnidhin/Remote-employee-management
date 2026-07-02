import { IsString, IsNotEmpty } from 'class-validator';

export class RequestEarlyOutDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
