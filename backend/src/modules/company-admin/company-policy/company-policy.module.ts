import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../../auth/presentation/auth/auth.module';
import {
  CompanyPolicy,
  CompanyPolicySchema,
} from './infrastructure/schema/company-policy.schema';
import { CompanyPolicyController } from './presentation/controller/company-policy.controller';
import { CompanyPolicyUseCase } from './application/use-case/company-policy.usecase';
import { CompanyPolicyRepositoryImpl } from './infrastructure/repositories/company-policy.repository.impl';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: CompanyPolicy.name, schema: CompanyPolicySchema },
    ]),
  ],
  controllers: [CompanyPolicyController],
  providers: [
    CompanyPolicyUseCase,
    {
      provide: POLICY_MESSAGES.COMPANY_POLICY_REPOSITORY,
      useClass: CompanyPolicyRepositoryImpl,
    },
  ],
})
export class CompanyPolicyModule { }
