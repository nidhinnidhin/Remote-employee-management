import type { SessionOptions } from "iron-session";

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  userId?: string;
  role?: string;    // For role-based routing
  email?: string;   // For display purposes
}

export const sessionOptions: SessionOptions = {
  cookieName: "app_session", // MUST MATCH browser cookie
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/", // 🔥 REQUIRED
  },
};
