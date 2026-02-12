import { PolicyType } from "src/shared/enums/company-policy/policy-type.enum";

export class CompanyPolicyEntity {
  id?: string;
  companyId: string;
  type: PolicyType;
  title: string;
  content: Record<string, any>;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
