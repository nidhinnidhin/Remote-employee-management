import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IDeleteSubscriptionPlanUseCase } from '../interfaces/subscription-plan.use-case.interface';
import type { ISubscriptionPlanRepository } from '../../domain/repositories/isubscription-plan.repository';

@Injectable()
export class DeleteSubscriptionPlanUseCase implements IDeleteSubscriptionPlanUseCase {
  constructor(
    @Inject('ISubscriptionPlanRepository')
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const plan = await this._subscriptionPlanRepository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Subscription plan with ID ${id} not found`);
    }

    await this._subscriptionPlanRepository.deleteById(id);
  }
}
