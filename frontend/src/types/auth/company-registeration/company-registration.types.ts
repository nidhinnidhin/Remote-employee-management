export interface FormData {
  companyName: string;
  companyEmail: string;
  employeeSize: string;
  industry: string;
  websiteUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export type Errors = Partial<Record<keyof FormData, string>>;
