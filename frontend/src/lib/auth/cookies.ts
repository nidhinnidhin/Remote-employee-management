import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";
import { cookies } from "next/headers";

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; 

export async function setRefreshTokenCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";

  (await cookies()).set(COOKIE_KEYS.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearRefreshTokenCookie() {
  (await cookies()).delete(COOKIE_KEYS.REFRESH_TOKEN);
}
