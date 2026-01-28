import { cookies } from "next/headers";

const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; 

export async function setRefreshTokenCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";

  (await cookies()).set("refresh_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearRefreshTokenCookie() {
  (await cookies()).delete("refresh_token");
}
