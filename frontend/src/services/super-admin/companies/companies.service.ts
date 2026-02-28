import { getServerApi } from "@/lib/axios/axiosSeriver";
import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";

export async function fetchCompanies(): Promise<CompanyApi[]> {
  const api = await getServerApi();
  const res = await api.get("/super-admin/companies");
  return res.data.data;
}