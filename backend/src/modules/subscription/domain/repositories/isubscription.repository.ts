import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface';
import { SubscriptionDocument } from '../../infrastructure/database/mongoose/schemas/subscription.schema';
import { Subscription } from '../../infrastructure/database/mongoose/schemas/subscription.schema';

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionDocument, Subscription> {
  findByCompanyId(companyId: string): Promise<Subscription | null>;
}
