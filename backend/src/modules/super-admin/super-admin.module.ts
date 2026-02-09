import { Module } from '@nestjs/common';
import { SuperAdminCompanyController } from './companies/presentation/controllers/super-admin-company.controller';
import { SuperAdminSeedService } from './services/super-admin-seed.service';
import { AuthModule } from '../company-admin/auth/presentation/auth/auth.module';
import { ListCompaniesUseCase } from './companies/application/use-cases/list-companies-use-case';
import { MongoCompanyRepository } from './companies/infrastructure/repositories/mongo-company.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDocument, CompanySchema } from '../company-admin/auth/infrastructure/database/mongoose/schemas/company.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CompanyDocument.name, schema: CompanySchema },
    ]),
  ],
  controllers: [SuperAdminCompanyController],
  providers: [
    ListCompaniesUseCase,
    SuperAdminSeedService,
    {
      provide: 'CompanyRepository',
      useClass: MongoCompanyRepository,
    },
  ],
})
export class SuperAdminModule { }
