import { SetMetadata } from '@nestjs/common';

export const CheckSubscriptionLimit = (type: 'projects' | 'members') => 
  SetMetadata('subscriptionLimitType', type);
