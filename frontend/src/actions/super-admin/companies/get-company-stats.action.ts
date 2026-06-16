"use server";

import { fetchCompanyStats } from "@/services/super-admin/companies/companies.service";
import { CompanyStats } from "@/shared/types/superadmin/companies/company.type";

export async function getCompanyStatsAction(): Promise<CompanyStats> {
  return fetchCompanyStats();
}
