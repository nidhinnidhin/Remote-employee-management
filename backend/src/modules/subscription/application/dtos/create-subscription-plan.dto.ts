import { IsString, IsNumber, IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { SubscriptionPlanType } from 'src/shared/enums/subscription/subscription-plan-type.enum';

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(SubscriptionPlanType)
  @IsNotEmpty()
  type: SubscriptionPlanType;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  isActive?: boolean;

  @IsNumber()
  maxProjects?: number;

  @IsNumber()
  maxMembers?: number;
}
