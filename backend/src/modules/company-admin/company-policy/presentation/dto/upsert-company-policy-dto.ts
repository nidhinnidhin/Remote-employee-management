import { IsArray, ValidateNested, IsString } from 'class-validator';
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
}

class PolicyDto {
  @IsString()
  type: string;

  @IsString()
  title: string;

  @ValidateNested()
  @Type(() => PolicyContentDto)
  content: PolicyContentDto;
}

export class UpsertCompanyPoliciesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PolicyDto)
  policies: PolicyDto[];
}
