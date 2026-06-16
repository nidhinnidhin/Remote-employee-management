export interface CompanyApi {
  id: string;
  name: string;
  email: string;
  size: string;
  industry: string;
  website?: string;
  createdAt: string;
  employeeCount: number;
  status: string;
}

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  suspendedCompanies: number;
}