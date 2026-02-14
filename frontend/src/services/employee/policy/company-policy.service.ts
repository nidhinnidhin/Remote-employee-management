import { clientApi } from "@/lib/axios/axiosClient";

export interface PolicySection {
  _id: string;
  title: string;
  points: string[];
}

export interface CompanyPolicy {
  _id: string;
  type: string;
  title: string;
  isActive: boolean;
  content: {
    sections: PolicySection[];
  };
}

export async function getCompanyPolicies(): Promise<CompanyPolicy[]> {
  const res = await clientApi.get("/company-policies");
  return res.data;
}
