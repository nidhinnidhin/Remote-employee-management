export interface SocialLoginInput {
  email: string;
  firstName: string;
  lastName: string;
  provider: string;
  providerId: string;
}

export interface SocialLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId?: string;
  };
}