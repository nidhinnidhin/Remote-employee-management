export enum SubscriptionPlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: SubscriptionPlanType;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubscriptionPlanDto {
  name: string;
  type: SubscriptionPlanType;
  price: number;
  description: string;
  features: string[];
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanDto extends Partial<CreateSubscriptionPlanDto> {}
