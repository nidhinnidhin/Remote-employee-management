import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

export const createOrUpdateCompanyPolicies = async (payload: any) => {
  const res = await clientApi.post(API_ROUTES.COMPANY.POLICIES, payload);
  return res.data;
};

export const getAdminCompanyPolicies = async () => {
  const res = await clientApi.get(API_ROUTES.COMPANY.POLICIES);
  return res.data;
};