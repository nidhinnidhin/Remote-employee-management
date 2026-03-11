export interface ICompanyPolicyUseCase {
    createOrUpdatePolicies(companyId: string, policies: any[]): Promise<any>;
    getPolicies(companyId: string): Promise<any>;
}
