import { clientApi } from "@/lib/axios/axiosClient";
import { CompanyPolicy } from "@/shared/types/company/policy/policy.type";



export async function getCompanyPolicies(): Promise<CompanyPolicy[]> {
  const res = await clientApi.get("/company-policies");
  return res.data;
}
