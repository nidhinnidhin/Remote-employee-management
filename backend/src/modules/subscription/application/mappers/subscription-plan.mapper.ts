import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanDocument } from '../../infrastructure/database/mongoose/schemas/subscription-plan.schema';

export class SubscriptionPlanMapper {
  static toDomain(raw: any): SubscriptionPlanEntity {
    return new SubscriptionPlanEntity(
      raw._id ? raw._id.toString() : raw.id,
      raw.name,
      raw.type,
      raw.price,
      raw.description,
      raw.features,
      raw.maxProjects,
      raw.maxMembers,
      raw.isActive,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(entity: SubscriptionPlanEntity): any {
    return {
      name: entity.name,
      type: entity.type,
      price: entity.price,
      description: entity.description,
      features: entity.features,
      maxProjects: entity.maxProjects,
      maxMembers: entity.maxMembers,
      isActive: entity.isActive,
    };
  }
}
