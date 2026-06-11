import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export interface PolicyPayload {
  policies: Array<{
    type: string;
    title: string;
    content: {
      sections: Array<{ title: string; points: string[] }>;
      [key: string]: unknown;
    };
    leaveDistribution?: Array<{ type: string; days: number }>;
    isActive?: boolean;
  }>;
}

export const createOrUpdateCompanyPolicies = async (payload: PolicyPayload) => {
  const res = await clientApi.post(API_ROUTES.COMPANY.POLICIES, payload);
  return res.data;
};

export const getAdminCompanyPolicies = async () => {
  const res = await clientApi.get(API_ROUTES.COMPANY.POLICIES);
  return res.data;
};