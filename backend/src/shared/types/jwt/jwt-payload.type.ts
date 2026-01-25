export interface JwtPayload {
  userId: string;
  role?: string;
  companyId?: string;
}

export interface RefreshTokenPayload {
  userId: string;
}