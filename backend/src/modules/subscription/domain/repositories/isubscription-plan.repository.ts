import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { SubscriptionPlanEntity } from '../entities/subscription-plan.entity';
import { SubscriptionPlanDocument } from '../../infrastructure/database/mongoose/schemas/subscription-plan.schema';

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlanDocument, SubscriptionPlanEntity> {
  findByName(name: string): Promise<SubscriptionPlanEntity | null>;
  findByType(type: string): Promise<SubscriptionPlanEntity | null>;
  create(entity: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity>;
}
