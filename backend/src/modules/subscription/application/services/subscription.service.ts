import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import type { ISubscriptionRepository } from '../../domain/repositories/isubscription.repository';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async getActivePlan(companyId: string) {
    const subscription = await this._subscriptionRepository.findByCompanyId(companyId);
    if (!subscription) return null;

    return this._subscriptionPlanRepository.findById(subscription.planId);
  }

  async checkLimit(companyId: string, type: 'maxProjects' | 'maxMembers', currentCount: number) {
    const plan = await this.getActivePlan(companyId);
    if (!plan) throw new ForbiddenException('No active subscription found');

    const limit = plan[type];
    if (limit === -1) return true; // Unlimited

    if (currentCount >= limit) {
      throw new ForbiddenException(`Your current plan limits you to ${limit} ${type === 'maxProjects' ? 'projects' : 'members'}. Please upgrade.`);
    }
    return true;
  }
}
