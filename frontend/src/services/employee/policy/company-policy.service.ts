import { clientApi } from "@/lib/axios/axiosClient";

export const getCompanyPolicies = async (companyId: string) => {
  const res = await clientApi.get(
    `/company-policies/${companyId}`
  );
  return res.data;
};