import { requireRole } from "@/lib/auth/unified-auth";
import { getCompaniesAction } from "@/actions/super-admin/companies/get-companies.action";
import CompaniesListing from "@/components/super-admin/companies/CompaniesList";

export default async function CompaniesPage() {
  // Protect the route - only allow SUPER_ADMIN
  await requireRole("SUPER_ADMIN");

  const companies = await getCompaniesAction();
  return <CompaniesListing initialCompanies={companies} />;
}
