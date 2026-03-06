import { getServerApi } from "@/lib/axios/axiosServer";
import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";
import { API_ROUTES } from "@/constants/api.routes";

export async function fetchCompanies(): Promise<CompanyApi[]> {
  const api = await getServerApi();
  const res = await api.get(API_ROUTES.SUPER_ADMIN.COMPANIES);
  return res.data.data;
}