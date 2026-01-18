import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SuperAdminCompanyController } from './interfaces/controllers/super-admin-company.controller';
import { COMPANY_READ_REPOSITORY } from './domain/tokens/company-read.tokens';
import { CompanyReadRepositoryImpl } from './domain/repositories/company-read.repository.impl';
import { CompanyDocument, CompanySchema } from '../company-admin/auth/infrastructure/database/mongoose/schemas/company.schema';
  import { ListCompaniesUseCase } from './application/use-cases/list-companies.usecase';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyDocument.name, schema: CompanySchema },
    ]),
  ],
  controllers: [SuperAdminCompanyController],
  providers: [
    ListCompaniesUseCase,
    {
      provide: COMPANY_READ_REPOSITORY,
      useClass: CompanyReadRepositoryImpl,
    },
  ],
})
export class SuperAdminModule {}
