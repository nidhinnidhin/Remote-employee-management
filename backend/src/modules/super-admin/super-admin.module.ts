import { Module, Inject } from '@nestjs/common';
import { SuperAdminCompanyController } from './presentation/controllers/super-admin-company.controller';
import { SuperAdminSeedService } from './services/super-admin-seed.service';
import type { ISuperAdminSeedService } from './services/isuper-admin-seed.service';
import { AuthModule } from '../auth/presentation/auth/auth.module';
import { ListCompaniesUseCase } from './application/use-cases/list-companies-use-case';
import { SuspendCompanyUseCase } from './application/use-cases/suspend-company.use-case';
import { MongoCompanyRepository } from './infrastructure/repositories/mongo-company.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyDocument, CompanySchema } from '../auth/infrastructure/database/mongoose/schemas/company.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CompanyDocument.name, schema: CompanySchema },
    ]),
  ],
  controllers: [SuperAdminCompanyController],
  providers: [
    {
      provide: 'IListCompaniesUseCase',
      useClass: ListCompaniesUseCase,
    },
    {
      provide: 'ISuspendCompanyUseCase',
      useClass: SuspendCompanyUseCase,
    },
    {
      provide: 'ISuperAdminSeedService',
      useClass: SuperAdminSeedService,
    },
    {
      provide: 'ICompanyRepository',
      useClass: MongoCompanyRepository,
    },
  ],
})
export class SuperAdminModule {
  constructor(
    @Inject('ISuperAdminSeedService')
    private readonly seedService: ISuperAdminSeedService
  ) { }
}
