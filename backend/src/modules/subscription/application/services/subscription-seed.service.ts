import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SubscriptionPlanType } from 'src/shared/enums/subscription/subscription-plan-type.enum';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';
import type { ILogger } from 'src/common/logger/interface/logger.interface';
import { LOGGER_SERVICE } from 'src/common/logger/tokens/logger.tokens';

@Injectable()
export class SubscriptionSeedService implements OnModuleInit {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
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
        maxProjects: 5,
        maxMembers: 5,
      },
      {
        name: 'PRO',
        type: SubscriptionPlanType.PRO,
        price: 399,
        description: 'For Growing Team',
        features: ['Upto 10 Projects', 'Upto 10 Members', 'Advance Supports'],
        maxProjects: 10,
        maxMembers: 10,
      },
      {
        name: 'ENTERPRISE',
        type: SubscriptionPlanType.ENTERPRISE,
        price: 999,
        description: 'For Large Team',
        features: ['Unlimited Projects', 'Unlimited Members', 'Dedicated Supports'],
        maxProjects: -1,
        maxMembers: -1,
      },
    ];

    for (const planData of plans) {
      try {
        const existingPlan = await this._subscriptionPlanRepository.findByType(planData.type);
        if (existingPlan) {
          this.logger.log(`Plan ${planData.name} exists. Updating limits...`);
          await this._subscriptionPlanRepository.updateById(existingPlan.id, {
            price: planData.price,
            maxProjects: planData.maxProjects,
            maxMembers: planData.maxMembers,
            features: planData.features,
          });
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
          planData.maxProjects,
          planData.maxMembers,
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
