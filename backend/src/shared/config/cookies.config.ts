import { CookieOptions } from 'express';

/* ================= ACCESS TOKEN ================= */

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false, // true in production (https)
  sameSite: 'lax',
  path: '/',
  maxAge: 1000 * 60 * 15, // 15 minutes
};

/* ================= REFRESH TOKEN ================= */

export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false, // true in production
  sameSite: 'lax',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};
