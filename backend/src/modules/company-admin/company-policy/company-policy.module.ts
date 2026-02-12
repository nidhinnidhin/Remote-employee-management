import { MongooseModule } from "@nestjs/mongoose";
import { CompanyPolicy, CompanyPolicySchema } from "./infrastructure/schema/company-policy.schema";
import { CompanyPolicyController } from "./presentation/controller/company-policy.controller";
import { CompanyPolicyUseCase } from "./application/use-case/company-policy.usecase";
import { CompanyPolicyRepositoryImpl } from "./infrastructure/repositories/company-policy.repository.impl";
import { Module } from "@nestjs/common";
import { COMPANY_POLICY_REPOSITORY } from "./domain/repositories/company-policy.repository.token";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanyPolicy.name, schema: CompanyPolicySchema },
    ]),
  ],
  controllers: [CompanyPolicyController],
  providers: [
    CompanyPolicyUseCase,
    {
      provide: COMPANY_POLICY_REPOSITORY,
      useClass: CompanyPolicyRepositoryImpl,
    },
  ],
})
export class CompanyPolicyModule {}
