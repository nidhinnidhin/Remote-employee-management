import { getCompaniesAction } from "@/app/actions/superadmin/companies/get-companies.action";
import CompaniesListing from "@/components/super-admin/companies/CompaniesList";

export default async function CompaniesPage() {
  const companies = await getCompaniesAction();
  return <CompaniesListing initialCompanies={companies} />;
}
