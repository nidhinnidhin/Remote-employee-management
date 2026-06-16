"use server";

import { fetchCompanies } from "@/services/super-admin/companies/companies.service";
import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";

export async function getCompaniesAction(search?: string, status?: string): Promise<CompanyApi[]> {
  return fetchCompanies(search, status);
}
