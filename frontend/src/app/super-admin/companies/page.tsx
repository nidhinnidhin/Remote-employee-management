import { requireRole } from "@/lib/auth/unified-auth";
import { getCompaniesAction } from "@/actions/super-admin/companies/get-companies.action";
import { getCompanyStatsAction } from "@/actions/super-admin/companies/get-company-stats.action";
import CompaniesListing from "@/components/super-admin/companies/CompaniesList";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Protect the route - only allow SUPER_ADMIN
  await requireRole("SUPER_ADMIN");

  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
  const status = typeof resolvedParams.status === "string" ? resolvedParams.status : undefined;

  const [companies, stats] = await Promise.all([
    getCompaniesAction(search, status),
    getCompanyStatsAction(),
  ]);

  return <CompaniesListing initialCompanies={companies} initialStats={stats} />;
}
