export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId?: string;
    isOnboarded: boolean;
  };
  message: string
}