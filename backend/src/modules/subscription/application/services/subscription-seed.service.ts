import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SubscriptionPlanType } from 'src/shared/enums/subscription/subscription-plan-type.enum';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';

@Injectable()
export class SubscriptionSeedService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionSeedService.name);

  constructor(
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Subscription Plans Seeder...');
    await this.seedPlans();
  }

  private async seedPlans() {
    const plans = [
      {
        name: 'FREE',
        type: SubscriptionPlanType.FREE,
        price: 0,
        description: 'For small team',
        features: ['Upto 5 Projects', 'Upto 5 Members', 'Basic supports'],
      },
      {
        name: 'PRO',
        type: SubscriptionPlanType.PRO,
        price: 399,
        description: 'For Growing Team',
        features: ['Upto 10 Projects', 'Upto 10 Members', 'Advance Supports'],
      },
      {
        name: 'ENTERPRISE',
        type: SubscriptionPlanType.ENTERPRISE,
        price: 999,
        description: 'For Large Team',
        features: ['Unlimited Projects', 'Unlimited Members', 'Dedicated Supports'],
      },
    ];

    for (const planData of plans) {
      try {
        const existingPlan = await this._subscriptionPlanRepository.findByType(planData.type);
        if (existingPlan) {
          this.logger.log(`Plan ${planData.name} already exists. Skipping.`);
          continue;
        }

        this.logger.log(`Creating ${planData.name} subscription plan...`);
        const newPlan = new SubscriptionPlanEntity(
          '',
          planData.name,
          planData.type,
          planData.price,
          planData.description,
          planData.features,
          true,
        );

        await this._subscriptionPlanRepository.create(newPlan);
        this.logger.log(`Plan ${planData.name} created successfully.`);
      } catch (error) {
        this.logger.error(`Failed to seed plan ${planData.name}: ${error.message}`);
      }
    }
  }
}
