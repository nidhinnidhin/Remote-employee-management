import { SubscriptionPlanType } from 'src/shared/enums/subscription/subscription-plan-type.enum';

export class SubscriptionPlanEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: SubscriptionPlanType,
    public readonly price: number,
    public readonly description: string,
    public readonly features: string[],
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
