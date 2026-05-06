import { Injectable, Inject } from '@nestjs/common';
import type { IGetAllSubscriptionPlansUseCase } from '../interfaces/subscription-plan.use-case.interface';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';

@Injectable()
export class GetAllSubscriptionPlansUseCase implements IGetAllSubscriptionPlansUseCase {
  constructor(
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(activeOnly = false): Promise<SubscriptionPlanEntity[]> {
    const filter = activeOnly ? { isActive: true } : {};
    return this._subscriptionPlanRepository.findAll(filter);
  }
}
