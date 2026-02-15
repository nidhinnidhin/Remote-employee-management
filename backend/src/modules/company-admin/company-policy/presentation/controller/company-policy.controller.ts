import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { CompanyPolicyUseCase } from '../../application/use-case/company-policy.usecase';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { UpsertCompanyPoliciesDto } from '../dto/upsert-company-policy-dto';
import { CompanyAdminOrEmployeeGuard } from 'src/shared/guards/company-admin-or-employee-access.guard';

@Controller('company-policies')
@UseGuards(JwtAuthGuard)
export class CompanyPolicyController {
  constructor(private readonly useCase: CompanyPolicyUseCase) {}

  // COMPANY ADMIN - ADD / UPDATE
  @Post()
  @UseGuards(CompanyAdminGuard)
  createOrUpdatePolicies(@Body() dto: UpsertCompanyPoliciesDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.useCase.createOrUpdatePolicies(companyId, dto.policies);
  }

  // COMPANY ADMIN OR EMPLOYEE - GET
  @Get()
  @UseGuards(CompanyAdminOrEmployeeGuard)
  getPoliciesForAdmin(@Req() req) {
    const companyId = req.user.companyId;
    return this.useCase.getPolicies(companyId);
  }
}
