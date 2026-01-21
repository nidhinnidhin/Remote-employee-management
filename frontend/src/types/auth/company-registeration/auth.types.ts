export interface CompanyRegistrationPayload {
  companyName: string
  email: string
  password: string
}

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data?: T
}
