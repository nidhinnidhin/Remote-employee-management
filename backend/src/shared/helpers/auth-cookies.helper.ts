import type { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from '../config/cookies.config';

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
): void {
  res.cookie(
    ACCESS_TOKEN_COOKIE_NAME,
    accessToken,
    ACCESS_TOKEN_COOKIE_OPTIONS,
  );
  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS,
  );
}
