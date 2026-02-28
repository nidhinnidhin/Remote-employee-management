export interface CompanyPolicyRepository {
  upsertCompanyPolicies(companyId: string, policies: any[]): Promise<any>;
  getCompanyPolicies(companyId: string): Promise<any>;
}
