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
