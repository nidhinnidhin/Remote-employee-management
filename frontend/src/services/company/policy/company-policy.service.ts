import { clientApi } from "@/lib/axios/axiosClient";

export const createOrUpdateCompanyPolicies = async (payload: any) => {
  const res = await clientApi.post("/company-policies", payload);
  return res.data;
};
