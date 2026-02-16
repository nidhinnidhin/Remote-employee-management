import type { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  cookieName: "app_session", // MUST MATCH browser cookie
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  },
};
