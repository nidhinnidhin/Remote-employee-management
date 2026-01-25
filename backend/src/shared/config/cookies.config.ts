import { CookieOptions } from 'express';

export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth/refresh',
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};