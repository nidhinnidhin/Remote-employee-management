import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import type { ICompanyPolicyUseCase } from '../../application/interfaces/company-policy-use-cases.interface';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { UpsertCompanyPoliciesDto } from '../../application/dto/upsert-company-policy-dto';
import { CompanyAdminOrEmployeeGuard } from 'src/shared/guards/company-admin-or-employee-access.guard';

@Controller('company-policies')
@UseGuards(JwtAuthGuard)
export class CompanyPolicyController {
  constructor(
    @Inject('ICompanyPolicyUseCase')
    private readonly _useCase: ICompanyPolicyUseCase,
  ) {}

  @Post()
  @UseGuards(CompanyAdminGuard)
  createOrUpdatePolicies(@Body() companyPolicyDto: UpsertCompanyPoliciesDto, @Req() req) {
    const companyId = req.user.companyId;
    return this._useCase.createOrUpdatePolicies(companyId, companyPolicyDto.policies);
  }

  // COMPANY ADMIN OR EMPLOYEE - GET
  @Get()
  @UseGuards(CompanyAdminOrEmployeeGuard)
  getPoliciesForAdmin(@Req() req) {
    const companyId = req.user.companyId;
    return this._useCase.getPolicies(companyId);
  }
}
