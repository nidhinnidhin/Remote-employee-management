import { CookieOptions } from 'express';
import { COOKIE_NAMES } from '../enums/cookie/cookie-name.enum';

/* ================= ACCESS TOKEN ================= */

export const ACCESS_TOKEN_COOKIE_NAME = COOKIE_NAMES.ACCESS_TOKEN;
export const INVITE_SESSION_COOKIE_NAME = COOKIE_NAMES.INVITE_SESSION;

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false, // true in production (https)
  sameSite: 'lax',
  path: '/',
  maxAge: 1000 * 60 * 15, // 15 minutes
};

/* ================= REFRESH TOKEN ================= */

export const REFRESH_TOKEN_COOKIE_NAME = COOKIE_NAMES.REFRESH_TOKEN;

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false, 
  sameSite: 'lax',
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

/* ================= INVITE SESSION ================= */

export const INVITE_SESSION_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 1000 * 60 * 10, // 10 minutes
};
