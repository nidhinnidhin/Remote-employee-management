export interface CompanyRegistrationFormData {
  companyName: string
  companyEmail: string
  companySize: string
  industry: string
  website: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  confirmPassword: string
}

export type FormErrors = Record<string, string>
