import { BillingCycle } from '../../types/company/billing-cycle.enum';
import { SubscriptionStatus } from '../../types/company/subscription-status.enum';

export class BillingClient {
  async createSubscription(data: {
    companyEmail: string;
    planId: string;
    billingCycle: BillingCycle;
  }) {
    // 🔴 MOCK RESPONSE (replace with real HTTP later)
    return {
      subscriptionPlanId: data.planId,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      billingCycle: data.billingCycle,
    };
  }
}
