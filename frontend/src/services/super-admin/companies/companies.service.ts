import { getServerApi } from "@/lib/axios/axiosServer";
import { CompanyApi, CompanyStats } from "@/shared/types/superadmin/companies/company.type";
import { API_ROUTES } from "@/constants/api.routes";

export async function fetchCompanies(search?: string, status?: string): Promise<CompanyApi[]> {
  const api = await getServerApi();
  const res = await api.get(API_ROUTES.SUPER_ADMIN.COMPANIES, {
    params: { search, status }
  });
  return res.data.data;
}

export async function fetchCompanyStats(): Promise<CompanyStats> {
  const api = await getServerApi();
  const res = await api.get(`${API_ROUTES.SUPER_ADMIN.COMPANIES}/stats`);
  return res.data.data;
}