import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUpdateSubscriptionPlanUseCase } from '../interfaces/subscription-plan.use-case.interface';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';
import { UpdateSubscriptionPlanDto } from '../dtos/update-subscription-plan.dto';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';

@Injectable()
export class UpdateSubscriptionPlanUseCase implements IUpdateSubscriptionPlanUseCase {
  constructor(
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(id: string, dto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlanEntity> {
    const plan = await this._subscriptionPlanRepository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    const updatedPlan = await this._subscriptionPlanRepository.updateById(id, dto);
    if (!updatedPlan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    return updatedPlan;
  }
}
