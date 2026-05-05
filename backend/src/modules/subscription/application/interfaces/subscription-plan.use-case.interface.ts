import { CreateSubscriptionPlanDto } from '../dtos/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../dtos/update-subscription-plan.dto';
import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';

export interface ICreateSubscriptionPlanUseCase {
  execute(dto: CreateSubscriptionPlanDto): Promise<SubscriptionPlanEntity>;
}

export interface IGetAllSubscriptionPlansUseCase {
  execute(): Promise<SubscriptionPlanEntity[]>;
}

export interface IUpdateSubscriptionPlanUseCase {
  execute(id: string, dto: UpdateSubscriptionPlanDto): Promise<SubscriptionPlanEntity>;
}

export interface IDeleteSubscriptionPlanUseCase {
  execute(id: string): Promise<void>;
}
