import {
  IsMongoId,
  IsArray,
  ValidateNested,
  IsEnum,
  IsString,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PolicyType } from 'src/shared/enums/company-policy/policy-type.enum';

class PolicyItemDto {
  @IsEnum(PolicyType)
  type: PolicyType;

  @IsString()
  title: string;

  @IsObject()
  content: Record<string, any>;
}

export class UpsertCompanyPoliciesDto {
  @IsMongoId()
  companyId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyItemDto)
  policies: PolicyItemDto[];
}
