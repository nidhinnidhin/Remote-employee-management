import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './infrastructure/database/mongoose/schemas/subscription-plan.schema';
import { SubscriptionPlanController } from './presentation/controllers/subscription-plan.controller';
import { MongoSubscriptionPlanRepository } from './infrastructure/database/repositories/mongo-subscription-plan.repository';
import { CreateSubscriptionPlanUseCase } from './application/use-cases/create-subscription-plan.use-case';
import { GetAllSubscriptionPlansUseCase } from './application/use-cases/get-all-subscription-plans.use-case';
import { UpdateSubscriptionPlanUseCase } from './application/use-cases/update-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from './application/use-cases/delete-subscription-plan.use-case';
import { SubscriptionSeedService } from './application/services/subscription-seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
  ],
  controllers: [SubscriptionPlanController],
  providers: [
    {
      provide: 'ISubscriptionPlanRepository',
      useClass: MongoSubscriptionPlanRepository,
    },
    {
      provide: 'ICreateSubscriptionPlanUseCase',
      useClass: CreateSubscriptionPlanUseCase,
    },
    {
      provide: 'IGetAllSubscriptionPlansUseCase',
      useClass: GetAllSubscriptionPlansUseCase,
    },
    {
      provide: 'IUpdateSubscriptionPlanUseCase',
      useClass: UpdateSubscriptionPlanUseCase,
    },
    {
      provide: 'IDeleteSubscriptionPlanUseCase',
      useClass: DeleteSubscriptionPlanUseCase,
    },
    SubscriptionSeedService,
  ],
  exports: [
    'ISubscriptionPlanRepository',
    'ICreateSubscriptionPlanUseCase',
    'IGetAllSubscriptionPlansUseCase',
    'IUpdateSubscriptionPlanUseCase',
    'IDeleteSubscriptionPlanUseCase',
  ],
})
export class SubscriptionModule {}
