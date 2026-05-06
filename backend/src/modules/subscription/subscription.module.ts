import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanSchema,
} from './infrastructure/database/mongoose/schemas/subscription-plan.schema';
import {
  Subscription,
  SubscriptionSchema,
} from './infrastructure/database/mongoose/schemas/subscription.schema';
import { SubscriptionPlanController } from './presentation/controllers/subscription-plan.controller';
import { SubscriptionController } from './presentation/controllers/subscription.controller';
import { MongoSubscriptionPlanRepository } from './infrastructure/database/repositories/mongo-subscription-plan.repository';
import { MongoSubscriptionRepository } from './infrastructure/database/repositories/mongo-subscription.repository';
import { CreateSubscriptionPlanUseCase } from './application/use-cases/create-subscription-plan.use-case';
import { GetAllSubscriptionPlansUseCase } from './application/use-cases/get-all-subscription-plans.use-case';
import { UpdateSubscriptionPlanUseCase } from './application/use-cases/update-subscription-plan.use-case';
import { DeleteSubscriptionPlanUseCase } from './application/use-cases/delete-subscription-plan.use-case';
import { RazorpayService } from 'src/shared/services/payment/razorpay.service';
import { AuthModule } from '../auth/presentation/auth/auth.module';
import { SubscriptionService } from './application/services/subscription.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SubscriptionPlanController, SubscriptionController],
  providers: [
    {
      provide: 'ISubscriptionPlanRepository',
      useClass: MongoSubscriptionPlanRepository,
    },
    {
      provide: 'ISubscriptionRepository',
      useClass: MongoSubscriptionRepository,
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
    RazorpayService,
    SubscriptionService,
  ],
  exports: [
    'ISubscriptionPlanRepository',
    'ISubscriptionRepository',
    'ICreateSubscriptionPlanUseCase',
    'IGetAllSubscriptionPlansUseCase',
    'IUpdateSubscriptionPlanUseCase',
    'IDeleteSubscriptionPlanUseCase',
    RazorpayService,
    SubscriptionService,
  ],
})
export class SubscriptionModule { }
