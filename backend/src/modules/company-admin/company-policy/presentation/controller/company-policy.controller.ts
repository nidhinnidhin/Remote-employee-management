import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompanyPolicyUseCase } from '../../application/use-case/company-policy.usecase';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { UpsertCompanyPoliciesDto } from '../dto/upsert-company-policy-dto';
import { SuperAdminGuard } from 'src/modules/super-admin/guards/super-admin.guard';

@UseGuards(JwtAuthGuard)
@Controller('company-policies')
export class CompanyPolicyController {
  constructor(private readonly useCase: CompanyPolicyUseCase) {}

  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Post()
  createOrUpdatePolicies(@Body() dto: UpsertCompanyPoliciesDto) {
    return this.useCase.createOrUpdatePolicies(dto.companyId, dto.policies);
  }

  // 🔒 AUTHENTICATED COMPANY USERS
  @UseGuards(JwtAuthGuard, SuperAdminGuard)
  @Get(':companyId')
  getPoliciesForCompany(@Param('companyId') companyId: string) {
    return this.useCase.getPolicies(companyId);
  }
}

