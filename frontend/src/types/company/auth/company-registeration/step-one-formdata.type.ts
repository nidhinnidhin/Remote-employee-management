export interface StepOneFormData {
  companyName: string;
  companyEmail: string;
  employeeSize: string;
  industry: string;
  websiteUrl: string;
}

export type StepOneErrors = Partial<Record<keyof StepOneFormData, string>>;