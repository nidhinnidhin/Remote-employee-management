import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { SubscriptionPlanEntity } from '../../../domain/entities/subscription-plan.entity';
import { ISubscriptionPlanRepository } from '../../../domain/repositories/isubscription-plan.repository';
import { SubscriptionPlanDocument, SubscriptionPlan } from '../mongoose/schemas/subscription-plan.schema';
import { SubscriptionPlanMapper } from '../../../application/mappers/subscription-plan.mapper';

@Injectable()
export class MongoSubscriptionPlanRepository
  extends BaseRepository<SubscriptionPlanDocument, SubscriptionPlanEntity>
  implements ISubscriptionPlanRepository
{
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly _subscriptionPlanModel: Model<SubscriptionPlanDocument>,
  ) {
    super(_subscriptionPlanModel);
  }

  protected toEntity(doc: SubscriptionPlanDocument): SubscriptionPlanEntity {
    return SubscriptionPlanMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<SubscriptionPlanEntity | null> {
    return this.findOne({ name });
  }

  async findByType(type: string): Promise<SubscriptionPlanEntity | null> {
    return this.findOne({ type });
  }

  async create(entity: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity> {
    const persistenceData = SubscriptionPlanMapper.toPersistence(entity);
    return this.save(persistenceData);
  }
}
