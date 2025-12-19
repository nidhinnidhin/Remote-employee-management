import { BillingCycle } from '../../../types/company/billing-cycle.enum';

export class RegisterCompanyDto {
  companyName: string;
  companyEmail: string;

  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  password: string;

  subscriptionPlanId: string;
  billingCycle: BillingCycle;
}
