import { SubscriptionPlanEntity } from '../../domain/entities/subscription-plan.entity';
import { SubscriptionPlanType } from 'src/shared/enums/subscription/subscription-plan-type.enum';

interface SubscriptionPlanRaw {
  _id?: { toString(): string } | string;
  id?: string;
  name?: string;
  type?: string;
  price?: number;
  description?: string;
  features?: string[];
  maxProjects?: number;
  maxMembers?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SubscriptionPlanMapper {
  static toDomain(raw: SubscriptionPlanRaw): SubscriptionPlanEntity {
    const id = raw._id
      ? (typeof raw._id === 'string' ? raw._id : raw._id.toString())
      : (raw.id ?? '');
    return new SubscriptionPlanEntity(
      id,
      raw.name ?? '',
      raw.type as SubscriptionPlanType,
      raw.price ?? 0,
      raw.description ?? '',
      raw.features ?? [],
      raw.maxProjects,
      raw.maxMembers,
      raw.isActive,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toPersistence(entity: SubscriptionPlanEntity): Record<string, unknown> {
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
