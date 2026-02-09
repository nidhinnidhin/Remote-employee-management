import { CompanyApi } from "@/shared/types/superadmin/companies/company.type";

export const getCompanies = async (): Promise<CompanyApi[]> => {
  const res = await fetch("/api/super-admin/companies", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  return data.data;
};
