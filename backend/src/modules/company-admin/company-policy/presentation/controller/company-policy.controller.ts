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

@Controller('company-policies')
@UseGuards(JwtAuthGuard) // Apply once globally
export class CompanyPolicyController {
  constructor(private readonly useCase: CompanyPolicyUseCase) {}

  // 👑 Super Admin can create/update policies
  @UseGuards(SuperAdminGuard)
  @Post()
  createOrUpdatePolicies(@Body() dto: UpsertCompanyPoliciesDto) {
    return this.useCase.createOrUpdatePolicies(
      dto.companyId,
      dto.policies,
    );
  }

  // 👩‍💻 Company users fetch their own company policies
  @Get()
  getMyCompanyPolicies(@Req() req) {
    return this.useCase.getPolicies(
      req.user.companyId,
    );
  }

  // 👑 Super Admin can fetch specific company policies
  @UseGuards(SuperAdminGuard)
  @Get(':companyId')
  getPoliciesForCompany(@Param('companyId') companyId: string) {
    return this.useCase.getPolicies(companyId);
  }
}
