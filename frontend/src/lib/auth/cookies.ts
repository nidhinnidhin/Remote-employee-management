import { COOKIE_KEYS } from "@/shared/constants/temp/cookie-keys";
import { cookies } from "next/headers";

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;
const ACCESS_TOKEN_MAX_AGE = 15 * 60;

// LOCAL_DEV=true is injected by docker-compose.local.yml.
// We cannot use NODE_ENV — the Dockerfile sets ENV NODE_ENV=production and
// Next.js standalone server.js re-enforces it, so NODE_ENV is always "production"
// inside the container even during local Docker runs.
const isLocalDev = process.env.LOCAL_DEV === "true";
const isProd = !isLocalDev;
const SAME_SITE = isProd ? ("none" as const) : ("lax" as const);

export async function setRefreshTokenCookie(token: string) {
  (await cookies()).set(COOKIE_KEYS.REFRESH_TOKEN, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: SAME_SITE,
    domain: isProd ? ".nidhintech.site" : undefined,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function setAccessTokenCookie(token: string) {
  (await cookies()).set(COOKIE_KEYS.ACCESS_TOKEN, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: SAME_SITE,
    domain: isProd ? ".nidhintech.site" : undefined,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

export async function clearRefreshTokenCookie() {
  (await cookies()).delete(COOKIE_KEYS.REFRESH_TOKEN);
}

export async function clearAccessTokenCookie() {
  (await cookies()).delete(COOKIE_KEYS.ACCESS_TOKEN);
}
