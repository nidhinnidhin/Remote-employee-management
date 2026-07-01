import { CookieOptions } from 'express';
import { COOKIE_NAMES } from '../enums/cookie/cookie-name.enum';

const isProd = process.env.NODE_ENV === 'production';

// sameSite "none" requires secure:true (HTTPS).
// In local dev (HTTP), browsers silently drop cookies with sameSite:none + secure:false.
// Use "lax" for dev so cookies are stored and sent correctly over HTTP on localhost.
const SAME_SITE: CookieOptions['sameSite'] = isProd ? 'none' : 'lax';

/* ================= ACCESS TOKEN ================= */

export const ACCESS_TOKEN_COOKIE_NAME = COOKIE_NAMES.ACCESS_TOKEN;
export const INVITE_SESSION_COOKIE_NAME = COOKIE_NAMES.INVITE_SESSION;

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: SAME_SITE,
  domain: isProd ? '.nidhintech.site' : undefined,
  path: '/',
  maxAge: 1000 * 60 * 15, // 15 minutes
};

/* ================= REFRESH TOKEN ================= */

export const REFRESH_TOKEN_COOKIE_NAME = COOKIE_NAMES.REFRESH_TOKEN;

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: SAME_SITE,
  domain: isProd ? '.nidhintech.site' : undefined,
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
};

/* ================= INVITE SESSION ================= */

export const INVITE_SESSION_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: SAME_SITE,
  domain: isProd ? '.nidhintech.site' : undefined,
  path: '/',
  maxAge: 1000 * 60 * 10, // 10 minutes
};
