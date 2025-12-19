export class RegisterCompanyDto {
  companyName: string;
  companyEmail: string;

  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  password: string;

  subscriptionPlanId: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
}
