import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { Subscription, SubscriptionDocument } from '../mongoose/schemas/subscription.schema';
import { ISubscriptionRepository } from '../../../domain/repositories/isubscription.repository';

@Injectable()
export class MongoSubscriptionRepository
  extends BaseRepository<SubscriptionDocument, Subscription>
  implements ISubscriptionRepository {
  constructor(
    @InjectModel(Subscription.name)
    private readonly _subscriptionModel: Model<SubscriptionDocument>,
  ) {
    super(_subscriptionModel);
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    return this.findOne({ companyId, status: 'ACTIVE' });
  }

  protected toEntity(doc: SubscriptionDocument): Subscription {
    // Check if doc has toObject (not lean)
    if (typeof doc.toObject === 'function') {
      return doc.toObject();
    }
    return doc;
  }
}
