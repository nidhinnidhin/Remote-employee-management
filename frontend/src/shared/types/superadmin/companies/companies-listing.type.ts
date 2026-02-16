export interface CompanyRow {
  id: string;
  name: string;
  email: string;
  logo: string;
  owner: string;
  plan: string;
  employees: number;
  status: "Active" | "Suspended";
  mrr: string;
  created: string;
}

export interface CompaniesListingProps {
  data: CompanyRow[];
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export interface StatsCardProps {
    title: string;
    value: string;
    percentage?: string;
    trend?: "up" | "down";
}